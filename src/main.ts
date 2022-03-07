import argParser from 'yargs-parser';
import { program } from 'commander';
import { abandonEvent, getEventIdByExecl, getEventIdByLike, login } from './lib';
import { print } from './utils';

const [actuator, entryPath, ...argv] = process.argv;
const {_: args, ...ops} = argParser(argv);

program
  .command('login')
  .description('login your account')
  .argument('<cookie>', 'cookie of your account')
  .action(async (cookie: string) => {
    await login(cookie);
  });

enum AbdAction {
  like = 'like',
  id = 'id',
  file = 'file'
}

program
  .command('abd <action>')
  .description('Abandon custom event by id')
  .argument('[projectId...]', 'Items to be cleaned')
  .action(async (action: AbdAction, ids: string[]) => {
    let eventIds
    switch (action) {
      case AbdAction.id:
        await abandonEvent(ids);
        break;
      case AbdAction.like:
        eventIds = await getEventIdByLike(ids);
        await abandonEvent(eventIds);
        break;
      case AbdAction.file:
        eventIds = await getEventIdByExecl(ids[0]);
        await abandonEvent(eventIds);
        break;
      default:
        print.red('Unknown action');
        break;
    }
  });

program.parse();
