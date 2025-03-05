import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import jwt from "jsonwebtoken";

export const authOptions = {
    providers: [
        CognitoProvider({
          clientId: process.env.AWS_CLIENT_ID as string,
          clientSecret: process.env.AWS_CLIENT_SECRET as string,
          issuer: process.env.AWS_ISSUER as string,
        }),
      ],
      callbacks: {
        async jwt({ token, account }) {
          if (account?.id_token) {
            const decoded = jwt.decode(account.id_token) as any;
            token.roles = decoded["cognito:groups"];
          }
          return token;
        },
        async session({ session, token }) {
          if (session?.user) {
            session.user.roles = token.roles;
          }
          return session;
        },
      },
  secret: process.env.NEXTAUTH_SECRET,
  strategy: "jwt"
};

const handler = NextAuth(authOptions);