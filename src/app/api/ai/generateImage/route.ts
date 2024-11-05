import { NextResponse, type NextRequest } from "next/server";



import Replicate from "replicate";




// nextjs-app
export const maxDuration = 60; // This function can run for a maximum of 60 seconds




const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});



export async function POST(request: NextRequest) {


    // array of strings
    // gold, silver, blue, red, green, black, white, yellow, orange, pink, purple, brown, gray, cyan, magenta
    const robotColors = ["gold", "silver", "blue", "red", "green", "black", "white", "yellow", "orange", "pink", "purple", "brown", "gray", "cyan", "magenta"];

    const randomColor = Math.floor(Math.random() * robotColors.length);

    const englishPrompt = "One cute and " + randomColor + "color metallic robot character with shiny skin in Japanese anime style. transparent background.";


    const negative_prompt = "easynegative,ng_deepnegative_v1_75t,((monochrome)),((grayscale)),bad-picture-chill-75v, (worst quality, low quality:1.4), monochrome, grayscale, sketches, paintings, lowres, normalres, blurry, acnes on face, {{sperm}}, {{bra}}";

    let input = {
        ///seed: 4234234,

        prompt: englishPrompt,

        output_quality: 90,

        //image_size: "square",
        image_size: "square",
        //image_size: "square_hd",

        disable_safety_checker: true,

        negative_prompt: negative_prompt,
    };



    let model = "" as any;

 
    const randomModel = Math.floor(Math.random() * 2);

    if (randomModel == 0) {
        model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";
    } else if (randomModel == 1) {
        model = "datacte/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019";
    }




    try {


        const [output] = await replicate.run(model, { input }) as any;

    
        if (output.error) {
            throw new Error(output.error);
        }

        const result = output.url();

        //console.log("result=", result);
        /*
        URL {
            href: 'https://replicate.delivery/yhqm/D2aV5KH1Ma7CH9KY8ZppQcZdbKIc5B43aJxQLmTl7hvJDe2JA/out-0.png',
            origin: 'https://replicate.delivery',
            protocol: 'https:',
            username: '',
            password: '',
            host: 'replicate.delivery',
            hostname: 'replicate.delivery',
            port: '',
            pathname: '/yhqm/D2aV5KH1Ma7CH9KY8ZppQcZdbKIc5B43aJxQLmTl7hvJDe2JA/out-0.png',
            search: '',
            searchParams: URLSearchParams {},
            hash: ''
        }
        */

        // get href from result string

        ///console.log("result=", result.toString());


        return NextResponse.json({

            result: {
                status: "ok",
                imageUrl: result.toString(),
            },
            
        });



    } catch (error) {
        console.log("error=", error);
    }

    return NextResponse.json({
        result: {
            status: "error",
        },
    });

}
