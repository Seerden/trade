/**
 * Simple async delay function,
 * @see https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
 * @usage when expecting to call an external API many times,
 * await this function with a sensible delay to ensure we don't
 * get rate limited
 */
export async function delay(msDelay: number) {
    return new Promise((resolve, reject) => {
        return setTimeout(resolve, msDelay);
    });
}
