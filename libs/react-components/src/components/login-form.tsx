import Link from "next/link";
import type React from "react";

import {Button} from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {Input} from "../ui/input";
import {Label} from "../ui/label";

export interface LoginFormProps {
    authProviderButtons: React.ReactNode;
}

export const LoginForm = ({authProviderButtons}: LoginFormProps) => (
    <div className={"flex flex-col gap-6"}>
        <Card className={"bg-background"}>
            <CardHeader className={"text-center"}>
                <CardTitle className={"text-xl"}>Welcome back</CardTitle>
                <CardDescription>
                    Login with your Apple or Google account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className={"grid gap-6"}>
                        <div className={"flex flex-col gap-4"}>
                            {authProviderButtons}
                        </div>
                        <div
                            className={
                                "relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                            }
                        >
                            <span
                                className={
                                    "relative z-10 bg-background px-2 text-muted-foreground"
                                }
                            >
                                Or continue with
                            </span>
                        </div>
                        <div className={"grid gap-6"}>
                            <div className={"grid gap-2"}>
                                <Label htmlFor={"email"}>Email</Label>
                                <Input
                                    id={"email"}
                                    placeholder={"m@example.com"}
                                    type={"email"}
                                    required
                                />
                            </div>
                            <div className={"grid gap-2"}>
                                <div className={"flex items-center"}>
                                    <Label htmlFor={"password"}>Password</Label>
                                    <Link
                                        className={
                                            "ml-auto text-sm underline-offset-4 hover:underline"
                                        }
                                        href={"/forgot-password"}
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id={"password"}
                                    type={"password"}
                                    required
                                />
                            </div>
                            <Button className={"w-full"} type={"submit"}>
                                Login
                            </Button>
                        </div>
                        <div className={"text-center text-sm"}>
                            Don&apos;t have an account?{" "}
                            <Link
                                className={"underline underline-offset-4"}
                                href={"/sign-up"}
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
        <div
            className={
                "text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
            }
        >
            By clicking continue, you agree to our{" "}
            <Link href={"/tos"}>Terms of Service</Link> and{" "}
            <Link href={"/privacy-policy"}>Privacy Policy</Link>.
        </div>
    </div>
);
