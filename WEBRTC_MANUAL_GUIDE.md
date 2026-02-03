# 🌐 WebRTC Manual Connection Guide

**Step-by-step guide for connecting players using manual signaling**

## 🚀 **How to Connect (Manual Method)**

Since WebRTC requires signaling between players, we'll use a manual exchange method for demo purposes.

### **📋 For the HOST:**

1. **Create Game**
   - Enter your name
   - Click "Create New Game"
   - Note your 6-digit Game Code

2. **Get OFFER Data**
   - Open browser console (F12)
   - Look for "=== HOST OFFER (Copy this and send to guest) ==="
   - Copy the entire OFFER JSON data

3. **Share with Friend**
   - Send the Game Code AND OFFER data to your friend
   - Wait for their ANSWER data

4. **Connect**
   - Click "Paste Friend's Answer" button
   - Paste the ANSWER data from your friend
   - Game will start automatically!

### **📋 For the GUEST:**

1. **Join Game**
   - Enter your name
   - Enter the Game Code from your friend
   - Click "Join"

2. **Paste OFFER Data**
   - When prompted, paste the OFFER data from your friend
   - Click OK

3. **Get ANSWER Data**
   - Open browser console (F12)
   - Look for "=== GUEST ANSWER (Copy this and send to host) ==="
   - Copy the entire ANSWER JSON data

4. **Send to Friend**
   - Send the ANSWER data back to the host
   - Game will start when host processes it!

## 💡 **Example Flow:**

```
HOST: Creates game → Gets OFFER data → Sends to guest
GUEST: Joins game → Pastes OFFER → Gets ANSWER → Sends to host  
HOST: Pastes ANSWER → Connection established → Game starts!
```

## 🔧 **Console Instructions:**

1. **Open Console**: Press F12 or right-click → Inspect → Console
2. **Find Data**: Look for the === markers in the console
3. **Copy Data**: Select the entire JSON object (starts with {, ends with })
4. **Share**: Send via chat, email, or messaging app

## ⚠️ **Important Notes:**

- **Complete Data**: Copy the ENTIRE JSON object, don't truncate
- **No Edits**: Don't modify the OFFER/ANSWER data
- **Quick Transfer**: The data expires after 5 minutes
- **Same Browser**: For testing, you can use same browser (works automatically)
- **Different Browsers**: Use manual method above

## 🎮 **Connection Status:**

- 🔴 **Disconnected** - Not connected
- 🟡 **Connecting** - Establishing connection
- 🟢 **Connected** - Ready to play!

## 🆘 **Troubleshooting:**

### **"Game not found" Error:**
- Check if you're using different browsers
- Use manual method with OFFER/ANSWER exchange

### **"Invalid OFFER data" Error:**
- Ensure you copied the complete JSON object
- Check for extra characters or missing parts

### **Connection Not Establishing:**
- Both players need to exchange OFFER/ANSER data
- Check console for any error messages
- Try refreshing and starting over

## 🚀 **Next Steps:**

In production, this would use:
- **Signaling Server** - Automatic data exchange
- **WebSocket** - Real-time communication
- **Room System** - Easy game discovery

For now, the manual method demonstrates WebRTC's peer-to-peer capabilities!

---

**Enjoy ultra-low latency multiplayer gaming! 🎮⚡**
