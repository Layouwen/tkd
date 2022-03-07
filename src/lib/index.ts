import fs from 'fs/promises';
import { homedir } from 'os';
import xlsx from 'xlsx';
import { getAllEvents, postAbandonEvent } from '../api';
import { print } from '../utils';

interface TalkingData {
  cookie?: string;
}

const FILE_DATA_NAME = 'talkingdata.json';

const getTKData = async () => {
  const path = `${homedir()}/${FILE_DATA_NAME}`;
  let data = {} as TalkingData;

  try {
    const fileData = await fs.readFile(path, {encoding: 'utf8'});
    data = JSON.parse(fileData);
  } catch (err) {}

  return data;
};

export const getEventIdByLike = async (ids: string[]) => {
  const data = await getTKData();
  const {cookie} = data;

  if (!cookie) {
    print.red('Please login first!');
    return;
  }

  const res = await getAllEvents({
    appToken: 'ef633a58da17',
    productId: '3302859',
    eventType: 'calculating',
    cookie,
    platformIds: '16',
  }).then(res => res.data);

  if (res.code === 200) {
    const {result} = res;
    const filterEvents = (eventId: string) => ids.some(id => eventId.includes(id));
    return result.filter(item => filterEvents(item.eventId)).map(item => item.eventId);
  } else {
    print.red('Get events failed!');
  }
};

export const getEventIdByExecl = async (filePath: string) => {
  const data = xlsx.readFile(filePath);
  const json = xlsx.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
  const notDelete = [];
  const notDeleteFiled = 'Not delete';
  for (let i = 0; i < json.length; i++) {
    if (!json[i].hasOwnProperty(notDeleteFiled)) break;
    notDelete.push(json[i][notDeleteFiled]);
  }

  const mustContain = [];
  const mustContainFiled = 'Must contain';
  for (let i = 0; i < json.length; i++) {
    if (!json[i].hasOwnProperty(mustContainFiled)) break;
    mustContain.push(json[i][mustContainFiled]);
  }

  let hasDeleteId = false;
  const deleteId = [];
  const deleteIdFiled = 'Delete id';
  for (let i = 0; i < json.length; i++) {
    if (json[i].hasOwnProperty(deleteIdFiled)) {
      hasDeleteId = true;
      deleteId.push(json[i][deleteIdFiled]);
    } else {
      break;
    }
  }

  // not delete id, use getAllEvent

  const mustContainFilter = (eventId: string) => mustContain.every(i => eventId.includes(i));
  const notDeleteFilter = (eventId: string) => !notDelete.some(i => eventId.includes(i));

  return deleteId.filter(mustContainFilter).filter(notDeleteFilter);
};

export const login = async (cookie: string) => {
  const path = `${homedir()}/${FILE_DATA_NAME}`;
  const data = await getTKData();
  data.cookie = cookie;
  await fs.writeFile(path, JSON.stringify(data));

  print.green('Cookie saved successfully!');
};

export const abandonEvent = async (eventIds: string[]) => {
  const data = await getTKData();
  const {cookie} = data;

  if (!cookie) {
    print.red('Please login first!');
    return;
  }
  const res = await postAbandonEvent({
    appToken: 'ef633a58da17',
    productId: '3302859',
    cookie,
    platformIds: '16',
    eventIds,
  }).then(res => res.data);
  if (res.code === 200) {
    print.green('Abandon event successfully!');
    console.log(eventIds);
  } else {
    print.red('Abandon event failed!');
  }
};
