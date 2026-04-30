// JWT Token Decoder - Check your current role
// Run this in browser console (F12) after login

function checkAdminRole() {
  console.log('🔍 Checking Admin Role...\n');

  // Get auth data from localStorage
  const authData = localStorage.getItem('veilvogue-auth');

  if (!authData) {
    console.error('❌ No auth data found. Please login first.');
    return;
  }

  try {
    const parsed = JSON.parse(authData);
    const state = parsed.state;

    console.log('📊 Current Auth State:');
    console.log('   User:', state.user?.name);
    console.log('   Email:', state.user?.email);
    console.log('   Role:', state.user?.role);
    console.log('   Is Admin:', state.isAdmin);
    console.log('   Is Authenticated:', state.isAuthenticated);
    console.log('');

    if (state.user?.role === 'ADMIN' && state.isAdmin === true) {
      console.log('✅ SUCCESS! You have ADMIN access');
      console.log('   You should see "Admin Dashboard" in navbar');
      console.log('');
      console.log('🎯 Test Admin Access:');
      console.log('   1. Check navbar for "Admin Dashboard" link');
      console.log('   2. Go to: http://localhost:3000/admin');
      console.log('   3. Try: http://localhost:3000/admin/products/new');
    } else {
      console.log('❌ ISSUE: Role is not ADMIN');
      console.log('');
      console.log('🔧 Fix Steps:');
      console.log('   1. Logout completely');
      console.log('   2. Clear localStorage (delete veilvogue-auth)');
      console.log('   3. Login again with: fhadikhan00@gmail.com');
      console.log('   4. Run this script again');
    }

    // Decode JWT token
    if (state.token) {
      console.log('\n🔐 JWT Token Info:');
      try {
        const parts = state.token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('   User ID:', payload.userId);
          console.log('   Email:', payload.email);
          console.log('   Role:', payload.role);
          console.log('   Issued:', new Date(payload.iat * 1000).toLocaleString());
          console.log('   Expires:', new Date(payload.exp * 1000).toLocaleString());

          if (payload.role !== 'ADMIN') {
            console.log('\n⚠️  WARNING: Token role is not ADMIN!');
            console.log('   You need to logout and login again.');
          }
        }
      } catch (e) {
        console.log('   Could not decode token');
      }
    }

  } catch (error) {
    console.error('❌ Error parsing auth data:', error);
  }
}

// Run the check
checkAdminRole();
