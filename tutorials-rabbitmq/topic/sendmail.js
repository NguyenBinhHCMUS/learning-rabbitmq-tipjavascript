const amqplib = require("amqplib");
const amqp_url_cloud =
  "amqps://ajwnpbua:lZn956XEXfr5VttPWHLrv30ZzS1vrBzP@armadillo.rmq.cloudamqp.com/ajwnpbua";
const amqp_url_docker = "amqp://localhost:5672";

const sendMail = async ({ msg }) => {
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

    const agrs = process.argv.slice(2);
    const msg = agrs[1] || "Fixed!";
    const topic = agrs[0];

    // 4. Publish mail
    await channel.publish(nameExchange, "", Buffer.from(msg));

    console.log(`[x] Send Ok:::${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error("Error:: ", error.message);
  }
};

const msg = process.argv.slice(2).join(" ") || "Send Mail";

sendMail({ msg });
