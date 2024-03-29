# About LangFlipFlop

LangFlipFlop is a lightweight app to practice translating from one language to another. Select a text from the list and read it one small fragment at a time. Try translating it in your head and then click or tap the text to compare your translation to ours. It's OK if the translation you had in mind doesn't match the suggestion - there can be more than one correct translation.

LangFlipFlop doesn't exactly teach you the language, but lets you practice it on real-life examples. It works best for language learners who are somewhat comfortable with the language, but struggling to apply it when talking about certain topics.

LangFlipFlop won't gamify your practice, won't ask you to register, won't collect any personal information, and won't bother you with notifications. Enjoy practicing your favorite language!

It currently supports English, Spanish and Russian.

# Get LangFlipFlop

LangFlopFlop is available at https://langflipflop.com or as an [Android app on Google Play](https://play.google.com/store/apps/details?id=com.langflipflop).

# Tech

LangFlipFlop is built with React and [Ionic Framework](https://ionicframework.com/).

The app is hosted on AWS and is fully serverless. Static content is in S3, fronted by CloudFront. The only component that interacts with the server after the app is loaded is feedback collection. The feedback is stored in DynamoDB, fronted by API Gateway.

# Development

```bash
npm install
make serve
```
