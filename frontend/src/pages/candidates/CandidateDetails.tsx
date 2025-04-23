import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { getCandidateDetails, updateCandidateStatus } from '../../services/candidates';
import { Candidate } from '../../types';
import toast from 'react-hot-toast';

const CandidateDetails: React.FC = () => {
  const { candidateAddress } = useParams<{ candidateAddress: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!candidateAddress) return;
      
      setLoading(true);
      try {
        const response = await getCandidateDetails(candidateAddress);
        
        if (response.success && response.data) {
          setCandidate(response.data);
        } else {
          toast.error(response.error || 'Failed to fetch candidate details');
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
        toast.error('An error occurred while fetching candidate details');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateAddress]);

  const handleStatusUpdate = async (status: 'Approved' | 'Rejected') => {
    if (!candidateAddress || !candidate) return;
    
    setUpdating(true);
    try {
      const response = await updateCandidateStatus(candidateAddress, status);
      
      if (response.success) {
        toast.success(`Candidate status updated to ${status}`);
        // Update the local state
        setCandidate({ ...candidate, status });
      } else {
        toast.error(response.error || 'Failed to update candidate status');
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error('An error occurred while updating candidate status');
    } finally {
      setUpdating(false);
    }
  };

  // Get appropriate badge for status
  const getBadgeDetails = (status: string | undefined) => {
    switch (status) {
      case 'Approved':
        return { variant: 'success', icon: <CheckCircle className="w-4 h-4 mr-1" />, text: 'Approved' };
      case 'Rejected':
        return { variant: 'danger', icon: <XCircle className="w-4 h-4 mr-1" />, text: 'Rejected' };
      default:
        return { variant: 'warning', icon: <Clock className="w-4 h-4 mr-1" />, text: 'Pending' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <Card>
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Candidate not found</h3>
          <p className="mt-1 text-sm text-gray-500">The candidate you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <Link to="/candidates">
              <Button variant="primary">Back to Candidates</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const badgeDetails = getBadgeDetails(candidate.status);

  return (
    <div>
      <div className="mb-6">
        <Link to="/candidates" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Candidates
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="bg-blue-100 p-5 rounded-full">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            
            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{candidate.name}</h1>
                  <p className="text-gray-600 mt-1">Candidate for {candidate.constituency}</p>
                </div>
                
                <Badge variant={badgeDetails.variant as any} size="md" className="mt-2 md:mt-0">
                  <span className="flex items-center">
                    {badgeDetails.icon}
                    {badgeDetails.text}
                  </span>
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Candidate Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p className="font-medium">{candidate.candidateAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Hash</p>
                    <p className="font-medium">{candidate.idHash}</p>
                  </div>
                </div>
              </div>
              
              {candidate.status === 'Pending' && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Update Candidate Status</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleStatusUpdate('Approved')}
                      isLoading={updating}
                    >
                      Approve Candidate
                    </Button>
                    <Button
                      variant="danger"
                      leftIcon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleStatusUpdate('Rejected')}
                      isLoading={updating}
                    >
                      Reject Candidate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDetails;