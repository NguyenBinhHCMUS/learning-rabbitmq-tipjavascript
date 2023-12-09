const amqplib = require("amqplib");
const amqp_url_cloud =
  "amqps://ajwnpbua:lZn956XEXfr5VttPWHLrv30ZzS1vrBzP@armadillo.rmq.cloudamqp.com/ajwnpbua";
const amqp_url_docker = "amqp://localhost:5672";

const sendQueue = async ({ msg }) => {
  try {
    // 1. Create connection
    // const connection = await amqplib.connect(amqp_url_cloud);
    const connection = await amqplib.connect(amqp_url_docker);

    // 2. Create channel
    const channel = await connection.createChannel();

    // 3. Create name queue
    const nameQueue = "q1";

    // 4. Create queue
    await channel.assertQueue(nameQueue, {
      durable: true, // False: Mất dữ liệu trong queue khi server cloud, docker bị drag, restart
    });

    // 5. Send to queue
    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
      expiration: "100000", // ==> TTL time to live: Trong 10s khong thuc hien se dong,
      persistent: true, // Neu cache co issue thi lay data tu disk
    });

    // 6. Close connection and channel
  } catch (error) {
    console.error("Error:: ", error.message);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello";

sendQueue({ msg });
