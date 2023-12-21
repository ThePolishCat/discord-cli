# **Discord Terminal Client**
## **Introduction**
This is a simple Discord terminal client built using Node.js and the Discord.js library. It allows users to connect to Discord, select a server, and interact with channels through the command line.

## **Features**
**Server and Channel Navigation:** Users can navigate through servers and channels using arrow keys.  
**Message Display:** Messages are displayed in a scrollable log, showing the sender's tag and message content.  
**Channel Switching:** Users can switch channels using the :c command followed by the channel ID.  
**Command Support:** The client supports basic commands such as :h for help, :q to exit, and :c to change channels.  
## **Setup**
### Install Dependencies:
```bash
npm install
```
### **Configure:**

Rename **config.json.example** to **config.json**.  
Add your Discord bot token and default channel ID to **config.json**.  
## **Run the Client:**
```bash
node index.js
```
## **Commands:**

`:h:` Show the help menu.  
`:q:` Exit the application.  
`:c <channel-id>:` Change the current channel.  
## **Usage**
Use arrow keys to navigate through servers and channels.  
Press i to enter input mode.  
Type your message and press Enter to send.  
## **Additional Notes**
Make sure your bot has the required intents enabled in the Discord Developer Portal.  
Use responsibly and respect Discord's Terms of Service.  
## **Contributing**
Feel free to contribute to the development of this project. Create an issue or submit a pull request.  

## **License**
This project is licensed under the GPL-3.0 License.
