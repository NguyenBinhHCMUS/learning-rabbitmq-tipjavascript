const amqplib = require("amqplib");
const amqp_url_cloud =
  "amqps://ajwnpbua:lZn956XEXfr5VttPWHLrv30ZzS1vrBzP@armadillo.rmq.cloudamqp.com/ajwnpbua";
const amqp_url_docker = "amqp://localhost:5672";

const postVideo = async ({ msg }) => {
  try {
    // 1. Create connection
    const connection = await amqplib.connect(amqp_url_cloud);

    // 2. Create channel
    const channel = await connection.createChannel();

    // 3. Create exchange
    const nameExchange = "video";

    await channel.assertExchange(nameExchange, "fanout", {
      durable: false,
    });

    // 4. Publish video
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

const msg = process.argv.slice(2).join(" ") || "Video PubSub";

postVideo({ msg });
