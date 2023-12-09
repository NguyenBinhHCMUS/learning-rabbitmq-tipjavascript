const amqplib = require("amqplib");
const amqp_url_cloud =
  "amqps://ajwnpbua:lZn956XEXfr5VttPWHLrv30ZzS1vrBzP@armadillo.rmq.cloudamqp.com/ajwnpbua";
const amqp_url_docker = "amqp://localhost:5672";

const receiveMail = async () => {
  try {
    // 1. Create connection
    const connection = await amqplib.connect(amqp_url_cloud);

    // 2. Create channel
    const channel = await connection.createChannel();

    // 3. Create exchange
    const nameExchange = "video";

    await channel.assertExchange(nameExchange, "topic", {
      durable: false,
    });

    // 4. Create queue
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
    });

    console.log(`Name Queue:: `, queue);

    // 5. Binding: Moi quan he giua exchange va queue
    const agrs = process.argv.slice(2);
    if (!agrs.length) {
      process.exit(0);
    }

    /* 
      * co nghia la phu hop voi bat ky tu na0
      # khop voi mot hoac nhieu tu bat ky
    */

    console.log(`waitting queue ${queue}::: topic::${agrs}`);

    agrs.forEach(async (key) => {
      await channel.bindQueue(queue, nameExchange, key);
    });

    await channel.consume(
      queue,
      (msg) => {
        console.log(
          `Routing key:${
            msg.fields.routingKey
          }::: msg:::${msg.content.toString()}`
        );
      },
      {
        noAck: true, // true: xác nhận đã nhận msg, false: chưa xác nhận, khi chạy consumer sẽ tiếp tục nhận msg
      }
    );
  } catch (error) {
    console.error("Error:: ", error.message);
  }
};

receiveMail();
