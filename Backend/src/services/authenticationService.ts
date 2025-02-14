import prisma from "../utils/client";
import { SignIn } from "../utils/types";

const logIn = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const signUp = async (details: SignIn): Promise<boolean> => {
  const invitation = await prisma.invitedEmail.findUnique({ where: { email: details.email } });

  if (invitation) {
    try {
      await prisma.$transaction([
        prisma.user.create({ 
          data: { 
            email: details.email,
            name: details.name,
            picture: details.picture || '',
            role: 'user',
          },
        }),
        prisma.invitedEmail.delete({ where: { email: details.email } }),
      ]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else return false;
}


export default {
  logIn,
  signUp,
};