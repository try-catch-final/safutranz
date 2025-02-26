const testing_utilsUtils = {
    validateInput: (data) => {
        const errors = {};
        
        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (data.password && data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }
        
        return errors;
    },

    formatData: (rawData) => {
        return {
            id: rawData.id,
            name: rawData.name?.trim() || '',
            email: rawData.email?.toLowerCase() || '',
            status: rawData.status || 'pending',
            createdAt: new Date(rawData.createdAt).toISOString(),
            updatedAt: new Date().toISOString()
        };
    },

    processItems: (items, filters = {}) => {
        let processed = [...items];
        
        if (filters.status) {
            processed = processed.filter(item => item.status === filters.status);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            processed = processed.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filters.sortBy) {
            processed = processed.sort((a, b) => {
                const aValue = a[filters.sortBy];
                const bValue = b[filters.sortBy];
                const modifier = filters.sortOrder === 'desc' ? -1 : 1;
                
                if (aValue < bValue) return -1 * modifier;
                if (aValue > bValue) return 1 * modifier;
                return 0;
            });
        }
        
        return processed;
    },

    generateReport: (data) => {
        const report = {
            total: data.length,
            active: data.filter(item => item.status === 'active').length,
            inactive: data.filter(item => item.status === 'inactive').length,
            pending: data.filter(item => item.status === 'pending').length,
            recentlyUpdated: data.filter(item => {
                const updatedAt = new Date(item.updatedAt);
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return updatedAt > dayAgo;
            }).length
        };
        
        return report;
    },

    exportToCSV: (data) => {
        const headers = ['ID', 'Name', 'Email', 'Status', 'Created At', 'Updated At'];
        const rows = data.map(item => [
            item.id,
            item.name,
            item.email,
            item.status,
            item.createdAt,
            item.updatedAt
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        return csvContent;
    },

    importFromCSV: (csvContent) => {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            const item = {};
            
            headers.forEach((header, index) => {
                item[header.toLowerCase().replace(' ', '_')] = values[index];
            });
            
            return item;
        });
    }
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default testing_utilsUtils;
