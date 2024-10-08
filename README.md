
# React Native Project Setup Guide

## Setup Instructions

## Node Version
 ```bash
v18.18.1
```

### 1. Initialize the Project
```bash
npx @react-native-community/cli@latest init <Project_Name>
cd <Project_Name>
```

### 2. Copy Package.json Dependencies
Replace dependencies and devDependencies in your project's package.json with the required packages.

### 3. Install Packages
```bash 
npm install
```
### 4. Folder Changes
Change App.tsx to App.js
Rename App.tsx to App.js and replace its content with the code from the template App.js.

Configure Import Alias
Copy the import alias configuration from babel.config.js in the template and paste it into your project's babel.config.js.

Add jsconfig.json
Copy jsconfig.json to the root level of your project for JavaScript language support.

Add src folder
Copy src folder and paste it into your project.

### 5. Setup React Native Vector Icons and Custom Fonts
Configure react-native.config.js
Copy the contents from react-native.config.js provided in the template to your project.

Apply Vector Icons in build.gradle
Add the following line in ./android/app/build.gradle:

```bash
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Final Steps
Clean the cache before running the app for the first time:

```bash
cd android
./gradlew clean
```

## Running the App
```bash
 npm run android
```
#   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 #   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 #   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 #   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 #   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 #   F i r e - D o o r - M o b i l e - A p p l i c a t i o n  
 