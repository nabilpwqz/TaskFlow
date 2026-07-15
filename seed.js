"use strict";
// MongoDB Seed Data Script (Optional)
// Run this in the backend to seed initial data
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const User_1 = require("./models/User");
const Task_1 = require("./models/Task");
const Review_1 = require("./models/Review");
const database_1 = require("./config/database");
async function seedDatabase() {
    try {
        await (0, database_1.connectDB)();
        // Clear existing data
        await User_1.User.deleteMany({});
        await Task_1.Task.deleteMany({});
        await Review_1.Review.deleteMany({});
        console.log('📝 Seeding database...');
        // Create users
        const users = await User_1.User.create([
            {
                name: 'Demo User',
                email: 'demo@taskflow.io',
                password: 'demo123',
                role: 'user',
            },
            {
                name: 'Admin User',
                email: 'admin@taskflow.io',
                password: 'admin123',
                role: 'admin',
            },
            {
                name: 'Sarah Chen',
                email: 'sarah@example.com',
                password: 'pass123',
                role: 'user',
            },
        ]);
        console.log(`✅ Created ${users.length} users`);
        // Create tasks
        const tasks = await Task_1.Task.create([
            {
                title: 'Build a Modern E-Commerce Website',
                shortDesc: 'Full-featured online store with React, Node.js, and Stripe integration.',
                fullDesc: 'I need a complete e-commerce solution built with React frontend and Node.js backend. Must include product catalog, shopping cart, Stripe payment processing, user accounts, order management, and an admin dashboard.',
                price: 2500,
                category: 'Web Development',
                imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
                userId: users[2]._id,
                status: 'open',
                rating: 4.8,
                reviewCount: 34,
            },
            {
                title: 'Brand Identity & Logo Design',
                shortDesc: 'Complete brand kit for a SaaS startup.',
                fullDesc: 'Looking for a talented designer to create a full brand identity including logo, color palette, typography, business cards, and social media templates.',
                price: 1200,
                category: 'Graphic Design',
                imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                userId: users[2]._id,
                status: 'open',
                rating: 4.9,
                reviewCount: 57,
            },
            {
                title: 'SEO-Optimized Blog Content (10 Articles)',
                shortDesc: 'High-quality blog posts targeting SaaS keywords.',
                fullDesc: 'Need 10 well-researched, SEO-optimized blog articles about SaaS topics including project management, team collaboration, and productivity.',
                price: 800,
                category: 'Content Writing',
                imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
                userId: users[0]._id,
                status: 'open',
                rating: 4.7,
                reviewCount: 22,
            },
            {
                title: 'Social Media Marketing Campaign',
                shortDesc: '3-month campaign across Instagram & LinkedIn.',
                fullDesc: 'Plan and execute a 3-month social media marketing campaign for our B2B SaaS product.',
                price: 3000,
                category: 'Digital Marketing',
                imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&h=400&fit=crop',
                userId: users[2]._id,
                status: 'open',
                rating: 4.6,
                reviewCount: 41,
            },
            {
                title: 'Mobile App UI/UX Redesign',
                shortDesc: 'Complete redesign of fitness tracking app.',
                fullDesc: 'Our fitness app needs a complete UI/UX overhaul. Looking for a designer to create modern, intuitive screens for iOS and Android.',
                price: 4500,
                category: 'Graphic Design',
                imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
                userId: users[0]._id,
                status: 'open',
                rating: 5.0,
                reviewCount: 18,
            },
            {
                title: 'Custom API Integration Service',
                shortDesc: 'Integrate third-party APIs into your platform.',
                fullDesc: 'Expert API integration services including payment gateways, shipping providers, CRM systems, and more.',
                price: 1800,
                category: 'Web Development',
                imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
                userId: users[2]._id,
                status: 'open',
                rating: 4.5,
                reviewCount: 29,
            },
            {
                title: 'Technical Whitepaper Writing',
                shortDesc: 'In-depth whitepaper on blockchain technology.',
                fullDesc: 'Need a comprehensive technical whitepaper (20-30 pages) explaining our blockchain-based supply chain solution.',
                price: 1500,
                category: 'Content Writing',
                imageUrl: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=600&h=400&fit=crop',
                userId: users[0]._id,
                status: 'open',
                rating: 4.8,
                reviewCount: 13,
            },
            {
                title: 'Google Ads Management',
                shortDesc: 'PPC campaign optimization & management.',
                fullDesc: 'Looking for a Google Ads expert to manage our PPC campaigns.',
                price: 2000,
                category: 'Digital Marketing',
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
                userId: users[2]._id,
                status: 'open',
                rating: 4.4,
                reviewCount: 35,
            },
        ]);
        console.log(`✅ Created ${tasks.length} tasks`);
        // Create reviews
        const reviews = await Review_1.Review.create([
            {
                taskId: tasks[0]._id,
                userId: users[0]._id,
                rating: 5,
                comment: 'Absolutely outstanding work! The developer delivered exactly what we needed.',
            },
            {
                taskId: tasks[0]._id,
                userId: users[1]._id,
                rating: 4,
                comment: 'Great quality, quick turnaround. Very professional.',
            },
            {
                taskId: tasks[1]._id,
                userId: users[0]._id,
                rating: 5,
                comment: 'Exceeded all expectations. Amazing designer!',
            },
        ]);
        console.log(`✅ Created ${reviews.length} reviews`);
        console.log('🌱 Database seeded successfully!');
    }
    catch (error) {
        console.error('❌ Seed error:', error);
    }
    finally {
        await (0, database_1.disconnectDB)();
    }
}
// Run if called directly
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map