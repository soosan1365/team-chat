export type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
  replyTo: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string | null;
    };
  } | null;
  type: string;
  audioUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
};
export type UploadAttachmentResponse = {
  fileUrl: string;
  fileName: string;
};

export type UploadAudioResponse = Message;
export type ReplyMessage = {
  id: string;
  content: string;
  senderName: string;
};
export type EditMessageParams = {
  roomId: string;
  messageId: string;
  content: string;
};