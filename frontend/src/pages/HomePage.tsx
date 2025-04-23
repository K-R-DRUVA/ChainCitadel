import React from 'react';
import { Vote, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  return (
    <div className="py-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Secure Distributed Voting System
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A transparent and secure platform for democratic participation
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/voters/register">
              <Button 
                variant="outline" 
                className="bg-white text-blue-700 hover:bg-blue-50"
                size="lg"
              >
                Register as Voter
              </Button>
            </Link>
            <Link to="/candidates/register">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                size="lg"
              >
                Register as Candidate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="transform transition duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voter Registration</h3>
              <p className="text-gray-600">
                Securely register with your identity and get verified to participate in elections.
              </p>
            </div>
          </Card>
          
          <Card className="transform transition duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Candidate Approval</h3>
              <p className="text-gray-600">
                Candidates register and undergo verification before being approved for the ballot.
              </p>
            </div>
          </Card>
          
          <Card className="transform transition duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Vote className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
              <p className="text-gray-600">
                Cast your vote securely with our distributed system ensuring transparency and integrity.
              </p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/voters" className="block">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 transition-colors hover:bg-blue-100">
              <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Voter Portal
              </h3>
              <p className="text-gray-600">
                Register as a voter, check your registration status, or verify your voting record.
              </p>
            </div>
          </Link>
          
          <Link to="/candidates" className="block">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 transition-colors hover:bg-purple-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Candidate Portal
              </h3>
              <p className="text-gray-600">
                View all candidates, register as a candidate, or check candidate approval status.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;