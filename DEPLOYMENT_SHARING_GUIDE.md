# 🌐 Valentine Generator - Deployment & Sharing Guide

## The Problem
When running on localhost (`http://localhost:5001`), the generated Valentine experience URLs only work on your local machine. Other people can't access `http://localhost:5001/v/sweet-heart-1234` from their devices.

## Solutions for Sharing

### 🚀 Option 1: Deploy to Public Server (Recommended)

**Free Hosting Options:**
- **Render.com** (Free tier available)
- **Railway.app** (Free tier available)  
- **Heroku** (Free tier discontinued, but paid plans available)
- **PythonAnywhere** (Free tier available)
- **Vercel** (Free tier available)

**Steps for Render.com (Easiest):**
1. Push your code to GitHub
2. Connect Render to your GitHub repo
3. Deploy as a Web Service
4. Your app gets a URL like `https://valentine-generator-abc123.onrender.com`
5. Generated links become `https://valentine-generator-abc123.onrender.com/v/sweet-heart-1234`

### 🔧 Option 2: Use ngrok for Testing (Quick Solution)

**Install ngrok:**
```bash
# Download from https://ngrok.com/
# Or install via package manager
npm install -g ngrok
# or
brew install ngrok
```

**Usage:**
```bash
# Start your Valentine Generator
cd valentine-generator
python app.py

# In another terminal, expose port 5001
ngrok http 5001
```

**Result:**
- ngrok gives you a public URL like `https://abc123.ngrok.io`
- Generated links become `https://abc123.ngrok.io/v/sweet-heart-1234`
- Anyone can access these links!

### 🏠 Option 3: Network Access (Local Network Only)

**For sharing within your home/office network:**

1. **Find your local IP:**
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)

# Mac/Linux  
ifconfig
# Look for inet address
```

2. **Update the app configuration:**
```python
# In valentine-generator/app.py, change the last lines:
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # This allows network access
        port=5001,
        debug=False
    )
```

3. **Share the network URL:**
- Instead of `localhost:5001`, use `http://192.168.1.100:5001`
- Generated links become `http://192.168.1.100:5001/v/sweet-heart-1234`
- Works for anyone on the same WiFi network

### ⚙️ Option 4: Configure Custom Domain

**For advanced users with a domain:**

```python
# Add to valentine-generator/app.py configuration
app.config.update(
    SERVER_NAME='yourdomain.com',  # Your domain
    PREFERRED_URL_SCHEME='https'   # Use HTTPS
)
```

## Current URL Generation Code

```python
# In create_experience() function:
experience_url = url_for('view_experience', unique_id=unique_id, _external=True)
```

This generates:
- **Localhost**: `http://localhost:5001/v/sweet-heart-1234` ❌ (Not shareable)
- **Deployed**: `https://yourapp.com/v/sweet-heart-1234` ✅ (Shareable)
- **ngrok**: `https://abc123.ngrok.io/v/sweet-heart-1234` ✅ (Shareable)

## Recommended Deployment Steps

### For Production (Render.com):

1. **Prepare for deployment:**
```bash
# Create requirements.txt if not exists
pip freeze > requirements.txt

# Create Procfile (for some platforms)
echo "web: python app.py" > Procfile
```

2. **Environment variables to set:**
```
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
PORT=5001
```

3. **Deploy and test:**
- Push to GitHub
- Connect to Render/Railway/etc.
- Deploy
- Test the generated URLs

### For Quick Testing (ngrok):

```bash
# Terminal 1: Start the app
cd valentine-generator
python app.py

# Terminal 2: Expose publicly
ngrok http 5001

# Copy the https://abc123.ngrok.io URL
# Create a Valentine experience
# Share the generated link!
```

## Security Considerations

- ✅ **Rate limiting**: App limits 10 experiences per IP per day
- ✅ **File validation**: Only allows video files up to 100MB
- ✅ **Secure filenames**: Uses secure_filename() for uploads
- ✅ **Experience expiry**: Experiences expire after 365 days
- ✅ **Input validation**: Validates all form inputs

## Testing the Sharing

1. **Create an experience** on your deployed/ngrok URL
2. **Copy the generated link** (e.g., `https://yourapp.com/v/sweet-heart-1234`)
3. **Share with someone** via WhatsApp, email, etc.
4. **They can view it** from any device with internet!

---

**Recommendation**: Use **Render.com** or **Railway.app** for free deployment, or **ngrok** for quick testing. This way, your Valentine experiences can be shared with anyone, anywhere! 💕