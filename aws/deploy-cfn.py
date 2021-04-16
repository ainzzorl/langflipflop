import sys
import os
from subprocess import Popen, PIPE, STDOUT

def run(command):
    process = Popen(command, stdout=PIPE, stderr=STDOUT, shell=True)
    while True:
        line = process.stdout.readline().rstrip()        
        if not line and process.poll() is not None:
            if process.returncode is not None and process.returncode != 0:
                print(f"Error code: {process.returncode}")
                exit(1)
            break
        if line:
            yield line

def run_and_print(cmd):
    for line in run(cmd):
        print(line.decode('utf-8'))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Usage: deploy-cfn.py STAGE')
        exit(1)
    stage = sys.argv[1]
    if stage not in ['alpha', 'prod']:
        print(f"Unknown stage: {stage}")
        exit(1)
    if stage == 'prod':
        print("Are you sure you want to deploy to prod?")
        print("Type 'yes' to confirm")
        if (input().lower() != 'yes'):
            print('Did not confirm, exiting')
            exit(1)

    packaged_template = f'aws/build/packaged-{stage}.template'

    package_cmd = f"aws --region us-east-1 cloudformation package \
            --template-file aws/cfn-templates/main.yaml \
            --s3-bucket langflipflop-cloudformation-us-east-1 \
            --output-template-file {packaged_template}"
    print("Running package command")
    print(package_cmd)
    run_and_print(package_cmd)
    print()

    stack_name = f"LangFlipFlop-{stage}"
    domain_name = 'langflipflop.com'
    if stage == 'prod':
        subdomain_name = 'www'
        apex = 'yes'
    else:
        subdomain_name = 'alpha'
        apex = 'no'

    deploy_cmd = f"aws --region us-east-1 cloudformation deploy \
                     --stack-name {stack_name} \
                     --template-file {packaged_template} \
                     --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
                     --parameter-overrides  DomainName={domain_name} SubDomain={subdomain_name} CreateApex={apex}"
    print("Running deploy command")
    print(deploy_cmd)
    run_and_print(deploy_cmd)
