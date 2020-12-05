import React from 'react';
import { Image, Layout } from '@components/common';

const About = () => {
    return (
        <Layout>
            <p>
                <Image
                    className="my-5 rounded-full w-20 h-20"
                    src={require('../../content/assets/avatar.png')}
                    webpSrc={require('../../content/assets/avatar.png?webp')}
                    previewSrc={require('../../content/assets/avatar.png?lqip')}
                    alt="Profile"
                />
            </p>
            <p className="my-5">
                Hi, my name is Dima Gimburg.
                I am a software engineer and programming is my passion since I started coding at 16 years old.
                Right now I'm working at Via as a team lead in the Logistics and Delivery Platforms products.
                I am enthusiastic about both frontend and backend, this is what I do in my day to day job.
                You can read more about my professional career in my linkedin page.
            </p>
            <p className="my-5">
                This blog is a personal blog, I don't manage an active twitter account so this is where I'll share my
                opinions and thoughts about anything I encounter as a programmer, a team lead and a human being in this
                world of software.
            </p>
            <p className="my-5">
                I am happily married to my beautiful wife Ya'ara and have a cute three years old son Jonathan.
                I really like music, and sometimes when I have some spare time (almost never 🤭) I play the electric guitar.
            </p>
            <p className="my-5">
                Feel free to contact me in anyway you like. I will be most responsive in my
                Facebook PM or Email (dima.gimburg@gmail.com).
            </p>
        </Layout>
    );
};

export default About;
