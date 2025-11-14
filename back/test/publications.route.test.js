import request from 'supertest'
import { describe, it, expect, beforeEach, afterAll ,vi} from 'vitest'
import app from '../app';
const databaseUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;
import {prisma} from '../src/model/prismamodel';

vi.mock('cloudinary', () => {
  return {
    v2: {
      uploader: {
        upload: vi.fn().mockResolvedValue({
          url: 'https://mocked-url.com/image.jpg',
          public_id:'asdads'
        }),
      },
      url: vi.fn().mockReturnValue('http://fake.cloudinary.com/fake_public_id'),
      config: vi.fn(),
      
    },
  };
});








// // beforeAll(async () => {
// //   // Limpiar DB antes de tests
// //   await prisma.user.deleteMany()
// // })
beforeEach(async () => {
  await prisma.likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.publications.deleteMany();
  await prisma.following.deleteMany();
  await prisma.messages.deleteMany();
  await prisma.session.deleteMany(); // ojo: tu modelo se llama "Session" pero prisma lo expone como `session`
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Publications API', () => {
    it('should create a user',async ()=>{
        const testUser={
            username:'pepito47',
            password:'12345678'
        }
        const response=await request(app).post('/logins/signup').send(testUser)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
    })
//   it('should response with  publications ', async () => {
//     const res = await request(app)
//       .get('/publications/publications')

//     expect(res.status).toBe(200)
//     expect(res.body).toHaveLength(7)
    
//   })
  it('should create a publication with an image', async () => {
    
const testUser = await prisma.user.create({
  data: {
   username:'aaa',
    password: 'hashedpassword',
  },
});
    const response = await request(app)
      .post(`/${testUser.id}/publication/`)
      .field('description', 'Esta es una publicación de prueba')
      .attach('publicationImg', 'test/assets/paisaje.png'); // archivo de prueba local

    expect(response.status).toBe(200);
    expect(response.body.publication).toHaveProperty('id');
    expect(response.body.publication).toHaveProperty('image_url', 'https://mocked-url.com/image.jpg');
    
    expect(response.body.publication).toHaveProperty('content', 'Esta es una publicación de prueba');
  });
  it('should update a publication succesfully',async()=>{
   const testUser = await prisma.user.create({
  data: {
   username:'aaa',
    password: 'hashedpassword',
  },
});
    const response=await request(app).post(`/${testUser.id}/publication/`).field("description",'hola papys').attach('publicationImg','test/assets/paisaje.png')
    
    expect(response.status).toBe(200)
    expect(response.body.publication).toHaveProperty('id')
    const updated= await request(app).put(`/publication/${response.body.publication.id}`).field("description",'change').attach('img','test/assets/paisaje.png')
    expect(updated.status).toBe(200)
    expect(updated.body.publication.content).toBe('change');

  })
  it('should delete a publication succesfully',async()=>{
    const testUser= await prisma.user.create({
      data:{
        username:'pepe',
        password:'1234356'
      }

    })
    const response=await request(app).post(`/${testUser.id}/publication/`).field("description",'hola papys').attach('publicationImg','test/assets/paisaje.png')
        expect(response.status).toBe(200)
    expect(response.body.publication).toHaveProperty('id')
    const deleted= await request(app).delete(`/publications/publications/${response.body.publication.id}`)
    expect(deleted.status).toBe(200)
  })
})


describe('Comments api',()=>{
  it('should create a comment succesfully',async()=>{
    const testUser = await prisma.user.create({
  data: {
   username:'aaa',
    password: 'hashedpassword',
  },
});
    const response = await request(app)
      .post(`/${testUser.id}/publication/`)
      .field('description', 'Esta es una publicación de prueba')
      .attach('publicationImg', 'test/assets/paisaje.png'); // archivo de prueba local

    expect(response.status).toBe(200);
    const comment={
comment:'aaa', userId:testUser.id, publicationId:response.body.publication.id
    }
    const responseCommnet= await request(app).post('/comments/comments').send(comment)
    expect(responseCommnet.status).toBe(200)
    expect(responseCommnet.body.createComment).toHaveProperty('post_id',response.body.publication.id)
  })
  
})
describe('Messages api',()=>{
  it('should create a message succesfully',async()=>{
    const testUser = await prisma.user.create({
  data: {
   username:'aaa',
    password: 'hashedpassword',
  },
});
  const testUser2 = await prisma.user.create({
  data: {
   username:'bbb',
    password: 'zxzx',
  },
});
  

    const message={
message:'aaa', receptorUser:testUser2, user:testUser
    }
    const responseCommnet= await request(app).post('/messages/messages').send(message)
    expect(responseCommnet.status).toBe(200)
    expect(responseCommnet.body.messageCreate).toHaveProperty('receptor_id',testUser2.id)
  })
})
describe('Likes api', ()=>{
  it('it should create a like',async()=>{
  const testUser = await prisma.user.create({
  data: {
   username:'aaa',
    password: 'hashedpassword',
  },
});
    const response = await request(app)
      .post(`/${testUser.id}/publication/`)
      .field('description', 'Esta es una publicación de prueba')
      .attach('publicationImg', 'test/assets/paisaje.png'); // archivo de prueba local

    expect(response.status).toBe(200);
    const like={
 publicationID:response.body.publication.id, userActiveID:testUser.id 

    }
    const likesResponse= await request(app).post('/likes/likes').send(like)
    expect(likesResponse.status).toBe(200)
    expect(likesResponse.body).toHaveProperty('post_id',response.body.publication.id)
})
it ('should delete a like',async()=>{
    const testUser = await prisma.user.create({
  data: {
   username:'asds',
    password: 'hashedpassword',
  },
});
    const response = await request(app)
      .post(`/${testUser.id}/publication/`)
      .field('description', 'Esta es una publicación de prueba')
      .attach('publicationImg', 'test/assets/paisaje.png'); // archivo de prueba local

    expect(response.status).toBe(200);
    const like={
 publicationID:response.body.publication.id, userActiveID:testUser.id 

    }
    const likesResponse= await request(app).post('/likes/likes').send(like)
    expect(likesResponse.status).toBe(200)

    const deleteLike=await request(app).delete(`/likes/likes/`).send({likeId:likesResponse.body.id})
    
    expect(deleteLike.status).toBe(200)
})
  }
)
describe('following api',async()=>{
  it('should a user can be follow another user succesfuly',async()=>{
    const testUser1=await prisma.user.create({
      data:{
        username:'pepe',
        password:'123'
      }
    })
    const testUser2=await prisma.user.create({
      data:{
        username:'pepe2',
        password:'123'
      }
    })
  const follow={
    userSessionId:testUser1.id,
    userlId:testUser2.id
  }
  const response=await request(app).post('/followings/following').send(follow)
  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('following_id',testUser1.id)
  })
  it('should a user can let follow another user ',async()=>{
        const testUser1=await prisma.user.create({
      data:{
        username:'pepe',
        password:'123'
      }
    })
    const testUser2=await prisma.user.create({
      data:{
        username:'pepe2',
        password:'123'
      }
    })
  const follow={
    userSessionId:testUser1.id,
    userlId:testUser2.id
  }
  const response=await request(app).post('/followings/following').send(follow)
  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('following_id',testUser1.id)
  const deletedLike=await request(app).delete('/followings/following').send({followId:response.body.id})
  expect(deletedLike.status).toBe(200)
  expect(deletedLike.body.id).toBe(response.body.id)
  })
})
describe('profile api',async()=>{
  it('should update the profile',async()=>{
 const testUser=await prisma.user.create({
    data:{
      username:'pepe',
      password:'aasasd'
    }
  })
  const response= await request(app).post(`/profile/${testUser.username}`).field('description','testeando user').attach('./assets/paisaje.png')
  expect(response.status).toBe(200)
  expect(response.body.user).toHaveProperty('description','testeando user')
  })
 
})