import readline from "readline";

export class LineReader {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public async readLine(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (input: string) => {
        resolve(input.trim());
      });
    });
  }

  public close(): void {
    this.rl.close();
  }
}
