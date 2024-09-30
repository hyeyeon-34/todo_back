const express = require('express'); // express 모듈 불러오기
const cors = require('cors'); // cors 모듈 불러오기
const PORT = 8000
const app = express(); // express 모듈을 사용하기 위해 app 변수에 할당한다.
const { spawn } = require('child_process')
// const spawn = require('child_process').spawn
const path = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const corsOptions = {
  origin: 'http://localhost:3000', // 허용할 주소
  credentials: true, // 인증 정보 허용
};

const corsOption2 = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:3000', // 허용할 주소
//   credentials: true, // 인증 정보 허용
// }));
 // http, https 프로토콜을 사용하는 서버 간의 통신을 허용한다.
app.use(express.json()); // express 모듈의 json() 메소드를 사용한다.

app.get('/', (req, res) => {
  res.send('HIIII again');
});

// app.get('/get_tasks', async (req, res) => {
//   try {
//     const result = await database.query('SELECT * FROM task');
//     return res.status(200).json(result.rows);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

app.use(require('./routers/getRoutes')); //getRoutes
app.use(require('./routers/postRoutes'));
app.use(require('./routers/deleteRoutes'));
app.use(require('./routers/updateRoutes'));
app.listen(PORT, () => console.log(`Server is running on ${PORT}`)); // 서버실행시 메시지


console.log(path.join(__dirname));

app.post('/chat', (req, res)=>{
  try {
    const sendedQuestion = req.body.question;


    // EC2 서버에서 현재 실행 중인 Node.js 파일의 절대 경로를 기준으로 설정.
    const scriptPath = path.join(__dirname, 'bizchat.py');
    
    // EC2 서버에서 실행하는 절대 경로 : 개발 테스트 시 사용 불가
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3'); 

    // 윈도우 환경
    // const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');


    // Spawn the Python process with the correct argument
    const result = spawn(pythonPath, [scriptPath, sendedQuestion]);


    // result.stdout.on('data', (data) => {
    //   console.log(data.toString());
    //   // return res.status(200).json(data.toString());
    // });


    let responseData = '';


    // Listen for data from the Python script
    result.stdout.on('data', (data) => {
      // console.log(data.toString());
      // res.status(200).json({ answer: data.toString() });
      responseData += data.toString();
    });


    // Listen for errors from the Python script
    result.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ error: data.toString() });
    });


    // Handle the close event of the child process
    result.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ answer: responseData });
      } else {
        res
          .status(500)
          .json({ error: `Child process exited with code ${code}` });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

})


// app.post('/chat', (req, res) => {
//   try {
//     const sendedQuestion = req.body.question;


//     // EC2 서버에서 현재 실행 중인 Node.js 파일의 절대 경로를 기준으로 설정합니다.
//     const scriptPath = path.join(__dirname, 'bizchat.py');
//     const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');


//     // Spawn the Python process with the correct argument
//     const result = spawn(pythonPath, [scriptPath, sendedQuestion]);


//     // result.stdout.on('data', (data) => {
//     //   console.log(data.toString());
//     //   // return res.status(200).json(data.toString());
//     // });


//     let responseData = '';


//     // Listen for data from the Python script
//     result.stdout.on('data', (data) => {
//       // console.log(data.toString());
//       // res.status(200).json({ answer: data.toString() });
//       responseData += data.toString();
//     });


//     // Listen for errors from the Python script
//     result.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//       res.status(500).json({ error: data.toString() });
//     });


//     // Handle the close event of the child process
//     result.on('close', (code) => {
//       if (code === 0) {
//         res.status(200).json({ answer: responseData });
//       } else {
//         res
//           .status(500)
//           .json({ error: `Child process exited with code ${code}` });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// })

app.post('/book', (req, res) => {
  try {
    const sendedQuestion = req.body.question; // 질문을 요청 본문에서 가져옴

    // book.py 스크립트의 절대 경로
    const scriptPath = path.join(__dirname, 'book.py');
    
    // Python 실행 경로
    const pythonPath = path.join(__dirname, 'venv', 'bin', 'python3');

    // Python 프로세스 시작
    const result = spawn(pythonPath, [scriptPath, sendedQuestion]);

    let responseData = '';

    // Python 스크립트의 stdout에서 데이터 수신
    result.stdout.on('data', (data) => {
      responseData += data.toString();
    });

    // 에러 처리
    result.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ error: data.toString() });
    });

    // 자식 프로세스 종료 이벤트 처리
    result.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ answer: responseData }); // 성공 시 응답
      } else {
        res.status(500).json({ error: `Child process exited with code ${code}` });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});