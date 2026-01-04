export interface CorsConfigInterface {
	origin: string;
	credentials: boolean;
}

export interface AuthInterface {
	username: string;
	password: string;
}

export interface UserInterface {
	id: string;
	username: string;
}
