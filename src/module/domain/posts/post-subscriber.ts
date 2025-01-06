import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Post } from './entities/post.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Post;
  }

  beforeInsert(event: InsertEvent<Post>): void | Promise<any> {
    console.log(`BEFORE POST INSERTED: `, event.entity);
  }
}
