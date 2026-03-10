import { db } from '@/db';
import { urls, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    // First, check if users exist in the database
    const existingUsers = await db.select({ id: user.id }).from(user).limit(3);
    
    let userIds: string[];
    
    if (existingUsers.length === 0) {
        // Create sample users with better-auth compatible text IDs
        const sampleUsers = [
            {
                id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
                name: 'John Doe',
                email: 'john.doe@example.com',
                emailVerified: true,
                image: null,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
            {
                id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                emailVerified: true,
                image: null,
                createdAt: new Date('2024-01-02'),
                updatedAt: new Date('2024-01-02'),
            },
            {
                id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                emailVerified: false,
                image: null,
                createdAt: new Date('2024-01-03'),
                updatedAt: new Date('2024-01-03'),
            },
        ];
        
        await db.insert(user).values(sampleUsers);
        userIds = sampleUsers.map(u => u.id);
        console.log('✅ Created sample users');
    } else {
        userIds = existingUsers.map(u => u.id);
        console.log('✅ Using existing users');
    }
    
    // Create 8 sample URL records with realistic data
    const sampleUrls = [
        {
            userId: userIds[0],
            originalUrl: 'https://github.com/vercel/next.js',
            shortCode: 'abc123',
            clicks: 45,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: userIds[0],
            originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            shortCode: 'def456',
            clicks: 123,
            createdAt: new Date('2024-01-08').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            userId: userIds[1] || userIds[0],
            originalUrl: 'https://stackoverflow.com/questions/tagged/javascript',
            shortCode: 'ghi789',
            clicks: 67,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            userId: userIds[1] || userIds[0],
            originalUrl: 'https://twitter.com/elonmusk',
            shortCode: 'jkl012',
            clicks: 89,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            userId: userIds[2] || userIds[0],
            originalUrl: 'https://www.reddit.com/r/programming',
            shortCode: 'mno345',
            clicks: 34,
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-24').toISOString(),
        },
        {
            userId: userIds[2] || userIds[0],
            originalUrl: 'https://www.linkedin.com/in/billgates',
            shortCode: 'pqr678',
            clicks: 12,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-26').toISOString(),
        },
        {
            userId: userIds[0],
            originalUrl: 'https://medium.com/@dan_abramov/youre-missing-the-point-of-react',
            shortCode: 'stu901',
            clicks: 150,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-28').toISOString(),
        },
        {
            userId: userIds[1] || userIds[0],
            originalUrl: 'https://www.google.com/search?q=typescript+tutorial',
            shortCode: 'vwx234',
            clicks: 0,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
    ];

    await db.insert(urls).values(sampleUrls);
    
    console.log('✅ URLs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});