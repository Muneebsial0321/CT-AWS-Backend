const Meeting = require('../Schemas/Meetings')
const ChatRoom = require('../Schemas/ChatRoom')
const Users = require('../Schemas/User')
const { v4: uuidv4 } = require('uuid');
const nf = require('../Functions/Notification_Factory')

const createMeeting = async (req, res) => {
  try {
    const meetingData = req.body;
    const _id = uuidv4()
    const newMeeting = new Meeting({ _id: _id, ...meetingData });
    await newMeeting.save();
    await nf(
      null, "created", 'Meeting', `A meeting was created in chatroom id:${req.body.chatroomID}`
    )

    res.json({ message: "success", data: newMeeting });
  } catch (error) {
    console.log(error)
    res.send(error);
  }
};

const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.scan().exec();
    res.json({ count: meetings.length, data: meetings });
  } catch (error) {
    console.log(error)
    res.send(error);
  }
};

const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.get(id);
    const { users } = await ChatRoom.get(meeting.chatroomID);
    const user = await Promise.all(users.map(async (e) => {
      const u = await Users.get(e)
      let { password, ...r } = u
      return r
    }))
    console.log({ user })
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.status(200).json({ meeting, user });
  } catch (error) {
    console.log(error)
    res.send(error);
  }
};

const updateMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedMeeting = await Meeting.update({ id }, updateData);
    res.status(200).json(updatedMeeting);
  } catch (error) {
    console.log(error)
    res.send(error);
  }
};

const deleteMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    await Meeting.delete(id);
    res.status(204).send();
  } catch (error) {
    console.log(error)
    res.send(error);
  }
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  // updateMeetingById,
  deleteMeetingById,
};
