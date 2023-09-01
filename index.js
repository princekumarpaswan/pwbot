const axios = require("axios");
const brainjs = require("brain.js")


const getAcess = async () => {

    const email = "prince.paswan@pw.live";
    const password = "kgvf514c0i"

    await axios({
        method: "post",
        url: "https://admin-api.pwskills.com/backend/login?jwtLogin=true",
        data: {
            email: email,
            password: password
        }
    }).then(
        (response) => {
            const tok = response.data
            const finalToken = tok.token
            // console.log(finalToken);
            getData(finalToken)
        }).catch((error) => console.log(error))

}

getAcess()


const getData = async (tokenData) => {

    const tokenDataa = tokenData
    try {
        const courseId = await axios.get(
            "https://admin-api.pwskills.com/admin/course/allcourses",
            {
                headers: {
                    Authorization: `Bearer ${tokenDataa}`
                }
            }
        );

        // console.log(courseId.data.data);
        const collectionOfCources = courseId.data.data
        let CourseTitleAndId = [];
        collectionOfCources.map((a) => (CourseTitleAndId.push({ title: a.title, id: a._id })))

        // console.log(CourseTitleAndId);

        Data(CourseTitleAndId, tokenDataa)

    } catch (error) {
        console.log(error);
    }


}

const Data = async (CourseTitleAndId, tokenDataa) => {

    const id = CourseTitleAndId[0].id
    const comment = [];
    const idd = [];

    try {
        const course = await axios.get(
            `https://admin-api.pwskills.com/admin/doubt/?skip=0&limit=50&courseId=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${tokenDataa}`
                }
            }

        );

        // console.log(course.data.data[0].comment);
        let commentData = course.data.data

        // console.log(commentData);



        // commentData/clear

        commentData.map((e) => comment.push(e.comment))
        commentData.map((e) => idd.push(e._id))

        // console.log(JSON.stringify(comment[0]));

        // comment.map((e) => console.log(JSON.stringify(e).slice(1, -1)))
        // idd.map((e) => console.log(e))


    } catch (error) {
        console.log(error);
    }

    getReply(idd, tokenDataa, comment)

}

const getReply = async (idd, tokenDataa, useCmt) => {

    let commment = []
    let doubt = useCmt;

    try {
        for (let i = 0; i < idd.length; i++) {
            const replyCall = await axios.get(`https://admin-api.pwskills.com/admin/doubt/replies/${idd[i]}`,

                {
                    headers: {
                        Authorization: `Bearer ${tokenDataa}`,
                    },
                }
            )
            commment.push(replyCall.data)
            // console.log(replyCall.data);

        }
    } catch (error) {
        console.log(error);
    }

    // console.log(comment);
    const reply = commment.map((e) => (JSON.stringify(e.data[0].comment)))

    console.log(reply);

    makeObject(reply, doubt)

}

const makeObject = (reply, doubt) => {

    const QNA = [];

    if (reply.length === doubt.length) {
        for (let i = 0; i < reply.length; i++) {

            QNA.push({ input: doubt[i], output: reply[i] })

        }
    }

    console.log(QNA);

    getTrain(QNA)

}

const getTrain = (QNA) => {
    const network = new brainjs.recurrent.LSTM();

    network.train(QNA)

    const output = network.run("sir why node js and express js is not the same thing")

    console.log(output);

}
