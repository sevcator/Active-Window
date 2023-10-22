const DiscordRPC = require('discord-rpc');
const aw = require('active-win');
const os = require('os');
// Created by sevcator
// Get windows info
const { platform, release, version, userInfo } = os;

// Client ID for show name app and rich presense images
const clientId = '1151742357314744400';

// Creating a rpc object
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// Creating a vars for change it
let previousWindow = null;
let Timestamp = new Date();	

async function updatePresence() {
  try {
    // Get info about active window
    const activeWindow = await aw();
    // Creating a vars to use it
    let details = '';
    let state = '';

    if (activeWindow) {
      // Add window title and ping var state
      details = activeWindow.title || '';
      state = '';
      
      // If app name exists using it to state
      if (activeWindow.owner && activeWindow.owner.name !== null) {
        state = activeWindow.owner.name || '';
      }

      // If app name matches window title using just details
      if (activeWindow.title === activeWindow.owner.name) {
        details = activeWindow.title;
      }

      // Some examples to spoof windows
      if (activeWindow.owner.name === "Windows Explorer" || activeWindow.owner.name === "Проводник") {
        state = '';
      }

      if (activeWindow.title === "Program Manager") {
        if (activeWindow.owner.name === "Windows Explorer") {
          details = 'Desktop';
        } else if (activeWindow.owner.name === "Проводник") {
          details = 'Рабочий стол';
        }
      }

      if (details === "Task Switching") {
        if (activeWindow.owner.name === "Windows Explorer" || activeWindow.owner.name === "Проводник") {
          details = 'Alt+Tab';
        }
      }

      if (details === "Переключение задач") {
        if (activeWindow.owner.name === "Windows Explorer" || activeWindow.owner.name === "Проводник") {
          details = 'Alt+Tab';
        }
      }

      if (activeWindow.title === "Search" && activeWindow.owner.name === "Search application") {
        details = 'Start Menu';
        state = '';
      }

      if (activeWindow.title === "Поиск" && activeWindow.owner.name === "Search application") {
  	details = 'Меню Пуск';
        state = '';
      }
    }
    
    // Reset time if window changed
    if (state !== previousWindow) {
      Timestamp = new Date();
      previousWindow = state;
    }

    // Ready rich presence
    const activity = {
      startTimestamp: Timestamp,
      largeImageKey: 'activewin-1',
      largeImageText: `System: ${os.version} [${os.release}]\nCurrent User: ${os.userInfo().username}`,
    };

    // If details length more 50 symbols fix it...
    if (details.length > 50) {
       cutted_details = details.substring(0, 50);
       details = `${cutted_details}...`
    }
	
	// If state length more 50 symbols fix it...
    if (state.length > 50) {
       cutted_state = state.substring(0, 50);
       state = `${cutted_state}...`
    }

    // If var details found, rich presence use it
    if (details) {
      activity.details = details;
    }

    // If var details not found, rich presence use No active window
    if (!details) {
      activity.details = 'Unknown';
    }
    
    // If var state found, rich presence use it
    if (state) {
      activity.state = state;
    }

    // Update presence
    rpc.setActivity(activity);
  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

rpc.on('ready', () => {
  console.clear()
  console.log(`Active Window v1.33 (default)`);
  console.log(``);
  console.log(`Logged as ${rpc.user.username}`);
  console.log(`Ctrl + C to exit`);
  updatePresence();
  setInterval(updatePresence, 1111);
});

rpc.login({ clientId }).catch(console.error);