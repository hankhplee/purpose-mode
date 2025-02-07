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
### Option 1: Install the Pre-Built Extension (Recommended)
[Click here](https://docs.google.com/document/d/1l6dxr0Ry2kj-7svdgO4RCIFF2GMbh0LyS04udKI4jXE/edit?usp=sharing) for step-by-step instructions on downloading and installing the pre-built extension.

### Option 2: Option 2: Build and Install from Source
If you want to modify the code or prefer to build the extension yourself, follow these steps:

1. Install Dependencies
```bash
pnpm install
# or
npm install
```
2. Build the Extension
```bash
pnpm build
# or
npm run build
```
This command creates a ./build/chrome-mv3-prod directory.

3. Load the Extension
    1. Navigate to ```chrome://extensions``` in your browser.
    2. Enable **Developer mode** (usually in the top-right corner).
    3. Click **Load unpacked** (top-left corner).
    4. Select the ```chrome-mv3-prod``` folder you just built.

4. All Set!
        You should now see Purpose Mode in your list of extensions. Pin it to your browser toolbar to access it quickly.

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
