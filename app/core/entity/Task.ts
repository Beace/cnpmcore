import { Entity, EntityData } from './Entity';
import { EasyData, EntityUtil } from '../util/EntityUtil';
import { TaskType, TaskState } from '../../common/enum/Task';
import dayjs from '../../common/dayjs';

interface TaskData extends EntityData {
  taskId: string;
  type: TaskType;
  state: TaskState;
  targetName: string;
  authorId: string;
  authorIp: string;
  data: unknown;
  logPath?: string;
  logStorePosition?: string;
  attempts?: number;
}

export type SyncPackageTaskOptions = {
  authorId?: string;
  authorIp?: string;
  tips?: string;
  skipDependencies?: boolean;
};

export class Task extends Entity {
  taskId: string;
  type: TaskType;
  state: TaskState;
  targetName: string;
  authorId: string;
  authorIp: string;
  data: unknown;
  logPath: string;
  logStorePosition: string;
  attempts: number;

  constructor(data: TaskData) {
    super(data);
    this.taskId = data.taskId;
    this.type = data.type;
    this.state = data.state;
    this.targetName = data.targetName;
    this.authorId = data.authorId;
    this.authorIp = data.authorIp;
    this.data = data.data;
    this.logPath = data.logPath ?? '';
    this.logStorePosition = data.logStorePosition ?? '';
    this.attempts = data.attempts ?? 0;
  }

  private static create(data: EasyData<TaskData, 'taskId'>): Task {
    const newData = EntityUtil.defaultData(data, 'taskId');
    return new Task(newData);
  }

  public static createSyncPackage(fullname: string, options?: SyncPackageTaskOptions): Task {
    const data = {
      type: TaskType.SyncPackage,
      state: TaskState.Waiting,
      targetName: fullname,
      authorId: options?.authorId ?? '',
      authorIp: options?.authorIp ?? '',
      data: { tips: options?.tips, skipDependencies: options?.skipDependencies },
    };
    const task = this.create(data);
    task.logPath = `/packages/${fullname}/syncs/${dayjs().format('YYYY/MM/DDHHMM')}-${task.taskId}.log`;
    return task;
  }
}