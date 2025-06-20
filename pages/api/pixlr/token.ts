import { NextApiRequest, NextApiResponse } from 'next';
import { Token } from '@pixlrlte/pixlr-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await Token.generate({
    clientKey: process.env.PIXLR_CLIENT_KEY!,
    clientSecret: process.env.PIXLR_CLIENT_SECRET!,
  }).createToken({
    mode: 'embedded',
    origin: process.env.NEXT_PUBLIC_APP_URL!,
  });

  res.status(200).json({ url: `https://pixlr.com/editor/?token=${token}` });
}

