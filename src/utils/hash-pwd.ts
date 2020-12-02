import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', 'erho o oHOoHO#hf83hf3fO#oif#OFh3o8ho8f oihO FOf3f O# HfOIF W f#W F#hfLFF iOISg4w83F)*0 09j09J09GJ094094WJ4E 09J  jElfEJLIFJ# of3 jf(#J#p9f3j9f #FjFjL#Fh o3hfwoifje093(* *');
    hmac.update(p);
    return hmac.digest('hex');
};
