export interface ProfileData {
    name: string;
    phoneNumber: string;
    role: string;
}

export interface UserProfile extends ProfileData {
    email: string;
    id: string;
}
