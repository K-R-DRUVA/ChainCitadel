import React from 'react';
import { UserCheck, VoteIcon, CheckSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const VotersPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <UserCheck className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Voter Portal</h1>
      </div>
      
      <p className="text-lg text-gray-600 mb-8">
        Register as a voter, check your voting status, or verify your registration.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Register as Voter</h3>
            <p className="text-gray-600 mb-6">
              Register to participate in upcoming elections by verifying your identity.
            </p>
            <Link to="/voters/register">
              <Button variant="primary" fullWidth>Register Now</Button>
            </Link>
          </div>
        </Card>
        
        <Card className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Check Registration</h3>
            <p className="text-gray-600 mb-6">
              Verify if you are registered to vote in your constituency.
            </p>
            <Link to="/voters/check-registration">
              <Button variant="outline" fullWidth>Check Status</Button>
            </Link>
          </div>
        </Card>
        
        <Card className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <VoteIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Verify Voting Status</h3>
            <p className="text-gray-600 mb-6">
              Check if you have already cast your vote in the current election.
            </p>
            <Link to="/voters/check-voted">
              <Button variant="outline" fullWidth>Verify Status</Button>
            </Link>
          </div>
        </Card>
        <Card className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Cast Vote</h3>
            <p className="text-gray-600 mb-6">
              Participate in the election by casting your vote securely and anonymously.
            </p>
            <Link to="/voters/cast-vote">
              <Button variant="outline" fullWidth>Cast Vote</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Why Register as a Voter?</h2>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
            <span>Securely participate in democratic elections</span>
          </li>
          <li className="flex items-start">
            <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
            <span>Your vote remains anonymous while ensuring you can only vote once</span>
          </li>
          <li className="flex items-start">
            <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
            <span>Verify your voting status at any time</span>
          </li>
          <li className="flex items-start">
            <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
            <span>Contribute to a transparent and secure electoral process</span>
          </li>
        </ul>
        <Link to="/voters/register">
          <Button variant="primary">Register as a Voter</Button>
        </Link>
      </div>
    </div>
  );
};

export default VotersPage;