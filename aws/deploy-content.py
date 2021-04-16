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
        print('Usage: deploy-content.py STAGE')
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

    if stage == 'alpha':
        bucket = 'langflipflop-alpha-s3stack-1jneqo1lb-s3bucketroot-1qgvrdtmog0pc'
    else:
        bucket = 'langflipflop-prod-s3stack-ml3y9la3ww-s3bucketroot-1c9t0bjieas5p'

    sync_cmd = f"aws --region us-east-1 s3 sync \
            build/ \
            s3://{bucket}"
    print("Running sync command")
    print(sync_cmd)
    run_and_print(sync_cmd)
    print()

    # TODO: invalidate
