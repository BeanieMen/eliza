import { consola } from "consola";
import { dedent } from "@/lib/util";
import { client } from "./fixtures";

async function main(): Promise<false | void> {
  const input = await consola.prompt(`Enter a string`, {
    initial: `eliza `,
  });

  // XXX This is a trash way of detecting, but blame unjs people
  if (typeof input === `symbol`) {
    consola.info(`^C - exit`);
    return false;
  }

  if (typeof input !== `string`) {
    console.warn(input);
    return;
  }

  if (input.match(/^[.!]?(?:exit|!?q(?:uit)?)$/)) {
    consola.info(`Exiting...`);
    return false;
  }

  // actually run input
  const response = await client.send(input);

  if (response.mockReplies.length === 0) {
    consola.info(`No reply`);
  } else {
    consola.info(response.mockReplies[0]);
  }
}

function intro() {
  consola.info(
    `\n ---- ` +
      dedent`
    Interactive eliza cli
    This simulates Discord chat without having to run the bot

    By default, all channels are active`
  );
}

(async () => {
  intro();

  for (;;) {
    const r = await main();
    if (r === false) {
      break;
    }
  }

  await client.destroy();
  consola.log(`Gracefully exited`);
})().catch((e) => {
  console.error(e);
});