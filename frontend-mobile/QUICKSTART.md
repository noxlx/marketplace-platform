# ⚡ Flutter App - Quick Start (5 Minutes)

## Copy & Paste These Commands

### Terminal 1: Install Dependencies
```bash
cd frontend-mobile
flutter pub get
```

### Terminal 2: Backend API
```bash
cd backend
npm install
npm run start:dev
```

You should see:
```
✅ Application is running on: http://localhost:3000/api/v1
📚 API Documentation: http://localhost:3000/api/docs
```

### Terminal 3: Docker Services
```bash
# From root folder
docker-compose up -d
```

### Terminal 1 Again: Start the App
```bash
# Still in frontend-mobile folder
flutter run
```

Or specify device:
```bash
flutter run -d "Pixel_4_API_30"    # Android emulator
flutter run -d "iPhone 14 Pro"      # iOS simulator  
flutter run -d web                  # Web browser
flutter run -d <device_id>          # Physical device
```

---

## 🎮 Control Keys (While App Running)

| Key | Action |
|-----|--------|
| `r` | Hot reload (instant code changes) |
| `R` | Hot restart (reset state + reload) |
| `W` | Show widget inspector |
| `q` | Quit app |
| `p` | Toggle performance overlay |

---

## ✅ What to Expect

1. **App launches** on emulator/phone
2. **Shows demo listings** immediately
3. **"Demo data mode"** indicator in header
4. **Tap login** (top right icon) to sign in
5. **Enter any phone number** like `+964771234567`
6. **Check backend console** for OTP code
7. **Enter OTP** to complete login
8. **Browse, create, and favorite listings**

---

## 🔍 Troubleshooting

### App won't build?
```bash
flutter clean
flutter pub get
flutter run
```

### Can't find emulator?
```bash
flutter emulators              # List all
flutter emulators launch Pixel_4_API_30  # Start one
```

### Backend connection fails?
- Verify backend running: `http://localhost:3000/api/v1`
- Check Docker: `docker-compose ps`
- Wait 30 seconds for services to start
- Android emulator uses `http://10.0.2.2:3000` (not localhost)

### Port already in use?
```bash
flutter run --web-port 54099
```

---

## 📖 Full Documentation

- `README.md` - Complete app documentation
- `FLUTTER_SETUP_GUIDE.md` - Detailed setup & running
- `IMPLEMENTATION_REVIEW.md` - What I built & how it works

---

## 🚀 You're Ready!

Your Flutter app is production-ready with:
- ✅ State management (Provider)
- ✅ Persistent authentication
- ✅ Real-time updates
- ✅ Demo data fallback
- ✅ Full API integration

**Start with the copy & paste commands above!**
