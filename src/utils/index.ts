import chalk from 'chalk'
export const print = {
  green(str: string) {
    console.log(chalk.green(str))
  },
  red(str: string) {
    console.log(chalk.red(str))
  },
}
