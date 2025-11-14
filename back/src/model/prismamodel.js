import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

class prismaModel {
 static async createUserModel(username, password) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  try {
    const userCreate = await prisma.user.create({
      data: {
        username,
        password
      }
    });
    return userCreate;
  } catch (e) {
    throw new Error(e.message || "Error creating user");
  }
}


  static async updateUserModel (username, profile, description) {
    const updateUser = await prisma.user.update({
      where: {
        username
      },
      data: {
        description,
        profileImg: profile

      }
    });
    return updateUser;
  }

  static async createPublicationModel (userid, url, description) {
    const publication = await prisma.publications.create({
      data: {
        user_id: userid,
        image_url: url,
        content: description
      }
    });
    return publication;
  }

  static async getPublicationModel (userid) {
    const publication = await prisma.publications.findMany({
      where: {
        user_id: userid
      }
    });
    return publication;
  }

  static async createCommentModel (comment, userId, publicationId) {
    const createComment = await prisma.comments.create({
      data: {
        content: comment,
        post_id: publicationId,
        user_id: userId

      }

    });
    return createComment;
  }

  static async getCommentsModel () {
    const comments = await prisma.comments.findMany();
    return comments;
  }

  static async getUserModel () {
    const users = await prisma.user.findMany();
    return users;
  }

  static async getPublicationsModel () {
    const publications = await prisma.publications.findMany();
    return publications;
  }

  static async createMessageModel (message, receptorUser, user) {
    
    const messageCreated = await prisma.messages.create({
      data: {
        content: message,
        sender_id: user,
        receptor_id: receptorUser
      }
    });
    return messageCreated;
  }

  static async getMessagesModel () {
    const messages = await prisma.messages.findMany();
    return messages;
  }

  static async postLikePublicationModel (likes, publicationID, userActiveID) {
    const likesPublication = prisma.likes.create({
      data: {
        user_id: userActiveID,
        post_id: publicationID
      }
    });
    return likesPublication;
  };

  static async deleteLikePublicationModel (likeId) {
    const likesPublication = prisma.likes.delete({
      where: {
        id: likeId
      }
    });
    return likesPublication;
  }

  static async getLikePublicationModel () {
    const likesPublication = await prisma.likes.findMany();
    return likesPublication;
  }

  static async followingUserModel (userSessionId, userlId) {
    const followingUser = await prisma.following.create({
      data: {
        follower_id: userlId,
        following_id: userSessionId
      }
    });
    return followingUser;
  };

  static async getfollowingUser () {
    const following = await prisma.following.findMany();
    return following;
  }

  static async letFollow (followId) {
    const following = await prisma.following.delete({
      where: {
        id: followId
      }
    });
    return following;
  }

  static async deletePublicationModel (publicationID) {
    const deletedPublication = await prisma.publications.delete({
      where: {
        id: publicationID
      }
    });
    return deletedPublication;
  }

  static async updatePublicationModel (publicationId, url, description) {
    const data = { content: description };

    if (url) {
      data.image_url = url;
    }
    const updatedPublication = await prisma.publications.update({
      where: {
        id: publicationId
      },
      data
    });
    return updatedPublication;
  }

  static async getuserModel (username) {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    });
    return user;
  }
}
export { prisma };
export default prismaModel;
