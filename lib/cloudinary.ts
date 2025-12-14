import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dq3vddbhi',
    api_key: process.env.CLOUDINARY_API_KEY || '556663513412298',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'mqDpYzKr12HAEoh5TmsoWsW7_gQ'
});

export default cloudinary;
