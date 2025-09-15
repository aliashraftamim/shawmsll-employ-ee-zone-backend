/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import { getIO } from "../../../../socket/socket.server";
import AppError from "../../../core/error/AppError";
import { Chat } from "./chat.model";

export default class ChatService {
  model = Chat;
  async getChat(payload: { myId: ObjectId; partnerId: ObjectId }) {
    if (!payload.partnerId) {
      throw new AppError(httpStatus.NOT_FOUND, "Partner ID is required");
    }

    const result = await Chat.find({
      $and: [
        {
          $or: [
            { sender: payload.myId, receiver: payload.partnerId },
            { sender: payload.partnerId, receiver: payload.myId },
          ],
        },
        { isShow: true },
      ],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "sender",
        select: "firstName surName email profileImage isOnline",
      })
      .populate({
        path: "receiver",
        select: "firstName surName email profileImage isOnline",
      });

    return result;
  }

  async getMyPartners(myId: ObjectId) {
    const partners = await Chat.aggregate([
      { $match: { sender: new mongoose.Types.ObjectId(myId as any) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$receiver",
          latestChat: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "receiverData",
        },
      },
      { $unwind: "$receiverData" },
      {
        $project: {
          _id: 0,
          receiver: "$receiverData._id",
          name: "$receiverData.profile.firstName",
          email: "$receiverData.email",
          profileImage: "$receiverData.profile.profileImage",
          isOnline: "$receiverData.isOnline",
          lastMessage: "$latestChat.content",
          createdAt: "$latestChat.createdAt",
          updatedAt: "$latestChat.updatedAt",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return partners;
  }

  async sendImages(payload: any) {
    const newChat = new Chat({
      sender: payload.myId,
      receiver: payload.body.partnerId,
      images: payload.body.images,
      content: payload.body.content || "",
      isImage: true,
      isShow: true,
      isRead: false,
      chatTime: new Date(),
    });

    const result = await Chat.create(newChat);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to send message");
    }

    const io = getIO();

    const msg = {
      sender: payload.myId,
      receiver: payload.body.partnerId,
      images: payload.body.images,
      content: payload.body.content || "",
      isImage: true,
      isShow: true,
      isRead: false,
      chatTime: new Date(),
    };

    io.emit(`receiverMsg::${payload.body.partnerId}`, msg);

    return result;
  }

  async getAllChat() {
    const result = await Chat.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "sender",
      })
      .populate({
        path: "receiver",
      });

    return result;
  }
}

export const chatService = new ChatService();
