import { UserAgent, Inviter, UserAgentDelegate } from 'sip.js';

/* 
公司的 bounc.sbc 可以連線
*/
//========================================

// 設定 UserAgentOptions
const uri = UserAgent.makeURI("sip:3004@bonuc.3cx.com.tw"); // 您的 SIP URI
const userAgentOptions = {
  uri,
  transportOptions: {
    server: 'wss://bonuc.sbc.telesale.org:7443/ws', // 您的 SIP WebSocket 伺服器
  },
  authorizationUsername: '3005', // 您的 SIP 帳號
  authorizationPassword: '1234'  // 您的 SIP 密碼
};
//========================================
/* 
  3CX
*/
//========================================

// 設定 UserAgentOptions
// const token = import.meta.env.VITE_3CX_TOKEN;

// const uri = UserAgent.makeURI("sip:victor@127.0.0.1:5483"); // 您的 SIP URI
// const userAgentOptions = {
//   uri,
//   transportOptions: {
//     server: 'ws://localhost:3081', // 您的 SIP WebSocket 伺服器
//     // connectionOptions: {
//     //   headers: {
//     //     'Authorization': `Bearer ${token}`
//     //   }
//     // }
//   },
//   // authorizationUsername: 'victor', // 您的 SIP 帳號
//   // authorizationPassword: '123456'  // 您的 SIP 密碼
// };

//========================================



// 建立 UserAgent
const userAgent = new UserAgent(userAgentOptions);

// 啟動 UserAgent
userAgent.start()
  .then(() => {
    console.log('SIP User Agent started');
  })
  .catch((error) => {
    console.error('Failed to start SIP User Agent:', error);
  });

  // 創建一個函數來發起通話。這個函數將使用 `Inviter` 來撥打電話
  function makeCall(targetURI) {
    const target = UserAgent.makeURI(targetURI);
    if (!target) {
      console.error('Invalid target URI');
      return;
    }
  
    const inviter = new Inviter(userAgent, target);
  
    // 發起通話
    inviter.invite()
      .then((session) => {
        console.log('Call initiated');

        // 獲取本地音訊流
        // navigator.mediaDevices.getUserMedia({ audio: true })
        // .then((stream) => {
        //   const audioElement = document.createElement('audio');
        //   audioElement.srcObject = stream;
        //   audioElement.play();
        // })
        // .catch((error) => {
        //   console.error('Error accessing media devices.', error);
        // });

        session.delegate = {
          onTrack: (track) => {
            console.log(track);
            if (track.kind === 'audio') {
              // 創建音訊元素
              const audioElement = document.createElement('audio');
              audioElement.srcObject = new MediaStream([track]);
              audioElement.play();
            }
          }
        };
      })
      .catch((error) => {
        console.error('Failed to initiate call:', error);
      });
  };



function App() {
  // 您可以在應用中添加一個按鈕來觸發撥打電話的功能
  const handleCall = () => {
    makeCall('sip:leo@127.0.0.1:5483'); // 替換為實際的目標號碼
  };

  return (
    <>
      <h1>Sip with 3cx</h1>
      <button onClick={handleCall}>撥打電話</button>
    </>
  )
}

export default App
