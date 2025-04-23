import React from 'react';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Candidate } from '../types';
import Card from './Card';
import Badge from './Badge';
import { Link } from 'react-router-dom';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Define status badge variant and icon
  const getBadgeDetails = (status: string | undefined) => {
    switch (status) {
      case 'Approved':
        return { variant: 'success', icon: <CheckCircle className="w-4 h-4 mr-1" /> };
      case 'Rejected':
        return { variant: 'danger', icon: <XCircle className="w-4 h-4 mr-1" /> };
      default:
        return { variant: 'warning', icon: <Clock className="w-4 h-4 mr-1" /> };
    }
  };

  const { variant, icon } = getBadgeDetails(candidate.status);

  return (
    <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-500">{candidate.constituency}</p>
          </div>
        </div>

        <div className="flex items-center mt-2 mb-4">
          <Badge variant={variant as any}>
            <span className="flex items-center">
              {icon}
              {candidate.status || 'Pending'}
            </span>
          </Badge>
        </div>

        <div className="text-sm text-gray-600 mb-4 flex-grow">
          <p className="mb-2">
            <span className="font-medium">Address:</span>{' '}
            {`${candidate.candidateAddress.substring(0, 6)}...${candidate.candidateAddress.substring(candidate.candidateAddress.length - 4)}`}
          </p>
        </div>

        <Link
          to={`/candidates/${candidate.candidateAddress}`}
          className="mt-auto text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </Card>
  );
};

export default CandidateCard;