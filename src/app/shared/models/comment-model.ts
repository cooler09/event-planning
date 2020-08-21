export class CommentModel {
  id: string;
  userId: string;
  userName: string;
  createdDate: Date;
  text: string;
  constructor(id: string, userId: string, createdDate: Date, text: string) {
    this.id = id;
    this.userId = userId;
    this.createdDate = createdDate;
    this.text = text;
  }
  setUsername(username: string) {
    this.userName = username;
    return this;
  }
}
