# Pharmacy App Deployment Guide

## Vercel Environment Variables
When deploying to Vercel, you need to add the following Environment Variables in the Project Settings:

### Firebase (Client Side - add NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD44BAPNO4-2IedfGKMQZlzG1uBCsMDfg4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pharmacy-1a3d0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pharmacy-1a3d0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pharmacy-1a3d0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=621222504820
NEXT_PUBLIC_FIREBASE_APP_ID=1:621222504820:web:126ea515db552153076421

### Cloudinary (Server Side)
CLOUDINARY_CLOUD_NAME=dq3vddbhi
CLOUDINARY_API_KEY=556663513412298
CLOUDINARY_API_SECRET=mqDpYzKr12HAEoh5TmsoWsW7_gQ

### AI Chat (Server Side)
GROQ_API_KEY=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

## Deployment Steps
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Copy the variables above into 'Settings > Environment Variables'.
4. Deploy!
