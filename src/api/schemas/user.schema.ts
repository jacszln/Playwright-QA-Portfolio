import { z } from 'zod';

const GeoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

const AddressSchema = z.object({
  street: z.string().min(1),
  suite: z.string().min(1),
  city: z.string().min(1),
  zipcode: z.string().min(1),
  geo: GeoSchema,
});

const CompanySchema = z.object({
  name: z.string().min(1),
  catchPhrase: z.string().min(1),
  bs: z.string().min(1),
});

/** Contract for a single JSONPlaceholder /users resource, including nested objects. */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  address: AddressSchema,
  phone: z.string().min(1),
  website: z.string().min(1),
  company: CompanySchema,
});

export const UserListSchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;
