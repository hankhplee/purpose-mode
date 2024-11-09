# Purpose Mode
Browser extension to "toggle off" Attention Capture Damaging Patterns (ACDPs) on social media websites

## What is Purpose Mode?
Purpose Mode is an extension for Chromium-based browsers
that allows you to browse social media websites with purpose,
free from distractions. Purpose Mode supports four popular social media websites: 
X/Twitter, Facebook, LinkedIn, and YouTube.

<img width="100%" src='https://github.com/hankhplee/gifs/blob/main/Purpose%20Mode%20overview.gif?raw=true'>

### Demo Video
<a href="https://www.youtube.com/watch?v=AWY8HQ_z_-c&ab_channel=HankLee">Purpose Mode Video Demo</a>



## Installation
Run the following:
```bash
pnpm install
# or
npm install
```

```bash
pnpm build
# or
npm run build
```

This should create the directory ./build/chrome-mv3-prod.
Next, go to your browser's extension page
(open chrome://extensions),
activate "Developer mode" in the top right corner,
and click on "Load unpacked" in the top left corner.
Select the directory "chrome-mv3-prod" that you just built.
That's it!

## Development

Start a development server like this:

```bash
pnpm dev
# or
npm run dev
```
