const amqplib = require("amqplib");
const amqp_url_cloud =
  "amqps://ajwnpbua:lZn956XEXfr5VttPWHLrv30ZzS1vrBzP@armadillo.rmq.cloudamqp.com/ajwnpbua";
const amqp_url_docker = "amqp://localhost:5672";

const receiveQueue = async () => {
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
      durable: true, // False: Mất dữ liệu khi server cloud bị dragconst amqp_url_cloud
    });

    // 5. receive from queue
    await channel.consume(
      nameQueue,
      (msg) => {
        console.log("Msg:: ", msg.content.toString());
      },
      {
        noAck: true, // true: xác nhận đã nhận msg, false: chưa xác nhận, khi chạy consumer sẽ tiếp tục nhận msg
      }
    );

    // 6. Close connection and channel
  } catch (error) {
    console.error("Error:: ", error.message);
  }
};

receiveQueue();
