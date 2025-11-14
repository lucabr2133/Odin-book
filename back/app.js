import e from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import router from './src/routes/route.js';
import { configPassport } from './config/passport.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { prisma } from './src/model/prismamodel.js';






const app = e();
const server=createServer(app)
const io= new Server(server, {cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }})

io.on('connection', (socket) => {

   socket.on("joinRoom", (userId) => {
    socket.join(userId);
  });
    socket.on("chat message",async ({  from, text,to }) => {
      const message=await prisma.messages.create({
        data:{
          content:text,
          sender_id:from,
          receptor_id:to,
        }
      })
      
    io.to(to).emit("chat message",message);
    socket.emit("chat message", message);
  });
  socket.on('publicationRomm',(publicationId)=>{
    socket.join(publicationId)
  })
  socket.on('publication comments',async({publicationId,from,text})=>{
    console.log(publicationId,from,text);
    
    let comment
    try{
     comment= await prisma.comments.create({
      data:{
        content:text,
        post_id:publicationId,
        user_id:from
      }
    })
    }catch(e){
      console.log(e);
      
    }

io.to(publicationId).emit("publication comments", comment);

  })
});

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Asegúrate de que sea el puerto correcto
  credentials: true // Permite enviar cookies en la solicitud
}));



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // store: new PrismaSessionStore(prisma, {
  //   checkPeriod: 2 * 60 * 1000, // Cada 2 minutos limpia sesiones expiradas
  //   dbRecordIdIsSessionId: true,
  //   dbRecordIdFunction: undefined
  // }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 día
    sameSite: 'lax', // Usa 'none' si tienes HTTPS
    httpOnly: true // Evita que JavaScript acceda a la cookie (buena práctica)
  }
}));
configPassport()

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);
app.get('/', (req, res) => {
  res.send('¡Hola desde mi app!');
});
export {server}
export default app;
