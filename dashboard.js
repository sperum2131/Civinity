// Load political orientation from localStorage
function loadPoliticalOrientation() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    const politicalOrientationInput = document.getElementById('politicalOrientationInput');
    
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            politicalOrientationInput.value = orientation.label;
        } catch (error) {
            politicalOrientationInput.value = 'Not Available';
        }
    } else {
        politicalOrientationInput.value = 'Not Available';
    }
}

// Initialize political orientation on page load
loadPoliticalOrientation();

function loadDescription() {
    const savedDescription = localStorage.getItem('politicalOrientation');
    const descriptionInput = document.getElementById('descriptionInput');

    if (savedDescription) {
        try {
            const description = JSON.parse(savedDescription);
            const descriptionText = description.description;
            descriptionInput.value = descriptionText;
        } catch (error) {
            descriptionInput.value = 'Not Available';
        }
    } else {
        descriptionInput.value = 'Not Available';
    }
}

// Initialize description on page load
loadDescription();

// Public figures database organized by political orientation
const publicFigures = {
    'strong-liberal': [
        {
            name: 'Bernie Sanders',
            role: 'U.S. Senator',
            description: 'Progressive leader advocating for universal healthcare, free college education, and economic justice.',
            tags: ['Progressive', 'Healthcare', 'Education', 'Economic Justice'],
            avatar: 'BS',
            color: '#1e40af',
            wiki: 'https://en.wikipedia.org/wiki/Bernie_Sanders',
            avatarImage: 'https://cdn.britannica.com/51/132851-050-D6CA13B6/Bernie-Sanders-2007.jpg'
        },
        {
            name: 'Alexandria Ocasio-Cortez',
            role: 'U.S. Representative',
            description: 'Progressive congresswoman known for the Green New Deal and fighting for working-class Americans.',
            tags: ['Progressive', 'Climate Action', 'Social Justice', 'Green New Deal'],
            avatar: 'AOC',
            color: '#1e40af',
            wiki: 'https://en.wikipedia.org/wiki/Alexandria_Ocasio-Cortez',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg/1200px-Alexandria_Ocasio-Cortez_Official_Portrait.jpg'
        },
        {
            name: 'Elizabeth Warren',
            role: 'U.S. Senator',
            description: 'Progressive senator focused on consumer protection, financial reform, and economic equality.',
            tags: ['Progressive', 'Consumer Protection', 'Financial Reform', 'Economic Equality'],
            avatar: 'EW',
            color: '#1e40af',
            wiki: 'https://en.wikipedia.org/wiki/Elizabeth_Warren',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Elizabeth_Warren%2C_official_portrait%2C_114th_Congress.jpg/800px-Elizabeth_Warren%2C_official_portrait%2C_114th_Congress.jpg'
        }
    ],
    'moderate-liberal': [
        {
            name: 'Joe Biden',
            role: 'U.S. President',
            description: 'Centrist Democrat focused on bipartisanship, infrastructure, and restoring international alliances.',
            tags: ['Centrist', 'Bipartisanship', 'Infrastructure', 'International Relations'],
            avatar: 'JB',
            color: '#2563eb',
            wiki: 'https://en.wikipedia.org/wiki/Joe_Biden',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg'
        },
        {
            name: 'Barack Obama',
            role: 'Former U.S. President',
            description: 'Former president known for healthcare reform, climate action, and diplomatic leadership.',
            tags: ['Healthcare', 'Climate Action', 'Diplomacy', 'Reform'],
            avatar: 'BO',
            color: '#2563eb',
            wiki: 'https://en.wikipedia.org/wiki/Barack_Obama',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/800px-President_Barack_Obama.jpg'
        },
        {
            name: 'Hillary Clinton',
            role: 'Former Secretary of State',
            description: 'Former senator and secretary of state advocating for women\'s rights and international cooperation.',
            tags: ['Women\'s Rights', 'International Relations', 'Healthcare', 'Education'],
            avatar: 'HC',
            color: '#2563eb',
            wiki: 'https://en.wikipedia.org/wiki/Hillary_Clinton',
            avatarImage: 'https://www.womenshistory.org/sites/default/files/styles/main_image/public/images/2018-07/Clinton_Hillary%20square.jpg'
        }
    ],
    'centrist': [
        {
            name: 'Joe Manchin',
            role: 'U.S. Senator',
            description: 'Moderate Democrat from West Virginia known for bipartisan cooperation and centrist positions.',
            tags: ['Bipartisan', 'Moderate', 'Energy', 'Infrastructure'],
            avatar: 'JM',
            color: '#6b7280',
            wiki: 'https://en.wikipedia.org/wiki/Joe_Manchin',
            avatarImage: 'https://cdn.britannica.com/92/150392-004-19647930/Joe-Manchin-2011.jpg'
        },
        {
            name: 'Susan Collins',
            role: 'U.S. Senator',
            description: 'Moderate Republican senator known for bipartisan legislation and independent voting record.',
            tags: ['Bipartisan', 'Moderate', 'Healthcare', 'Infrastructure'],
            avatar: 'SC',
            color: '#6b7280',
            wiki: 'https://en.wikipedia.org/wiki/Susan_Collins',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Senator_Susan_Collins_2014_official_portrait.jpg/960px-Senator_Susan_Collins_2014_official_portrait.jpg'
        },
        {
            name: 'Lisa Murkowski',
            role: 'U.S. Senator',
            description: 'Independent-minded Republican senator focused on Alaska issues and bipartisan solutions.',
            tags: ['Bipartisan', 'Energy', 'Environment', 'Indigenous Rights'],
            avatar: 'LM',
            color: '#6b7280',
            wiki: 'https://en.wikipedia.org/wiki/Lisa_Murkowski',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Lisa_Murkowski_official_photo.jpg'
        }
    ],
    'moderate-conservative': [
        {
            name: 'Mitt Romney',
            role: 'U.S. Senator',
            description: 'Moderate Republican senator known for bipartisan cooperation and traditional conservative values.',
            tags: ['Bipartisan', 'Fiscal Conservative', 'Foreign Policy', 'Healthcare'],
            avatar: 'MR',
            color: '#dc2626',
            wiki: 'https://en.wikipedia.org/wiki/Mitt_Romney',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Mitt_Romney_official_US_Senate_portrait.jpg/1200px-Mitt_Romney_official_US_Senate_portrait.jpg'
        },
        {
            name: 'Larry Hogan',
            role: 'Former Governor',
            description: 'Former Maryland governor known for pragmatic leadership and bipartisan governance.',
            tags: ['Bipartisan', 'Fiscal Conservative', 'Infrastructure', 'Healthcare'],
            avatar: 'LH',
            color: '#dc2626',
            wiki: 'https://en.wikipedia.org/wiki/Larry_Hogan',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Larry_Hogan_%282021%29_%28cropped%29.jpg'
        },
        {
            name: 'Charlie Baker',
            role: 'Former Governor',
            description: 'Former Massachusetts governor known for moderate Republican policies and bipartisan cooperation.',
            tags: ['Bipartisan', 'Healthcare', 'Education', 'Infrastructure'],
            avatar: 'CB',
            color: '#dc2626',
            wiki: 'https://en.wikipedia.org/wiki/Charlie_Baker',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Charlie_Baker_official_photo_%28portrait_cropped%29.jpg'
        }
    ],
    'strong-conservative': [
        {
            name: 'Donald Trump',
            role: 'Former U.S. President',
            description: 'Conservative leader focused on America First policies, border security, and economic nationalism.',
            tags: ['America First', 'Border Security', 'Economic Nationalism', 'Conservative'],
            avatar: 'DT',
            color: '#991b1b',
            wiki: 'https://en.wikipedia.org/wiki/Donald_Trump',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg'
        },
        {
            name: 'Ted Cruz',
            role: 'U.S. Senator',
            description: 'Conservative senator known for constitutional originalism and limited government advocacy.',
            tags: ['Conservative', 'Constitutional Originalism', 'Limited Government', 'Pro-Life'],
            avatar: 'TC',
            color: '#991b1b',
            wiki: 'https://en.wikipedia.org/wiki/Ted_Cruz',
            avatarImage: 'https://static.texastribune.org/media/files/600d28682a2731e6cfa9649926acbc5a/Ted-Cruz.jpg'
        },
        {
            name: 'Marjorie Taylor Greene',
            role: 'U.S. Representative',
            description: 'Conservative congresswoman known for America First policies and challenging establishment politics.',
            tags: ['Conservative', 'America First', 'Pro-Life', 'Second Amendment'],
            avatar: 'MTG',
            color: '#991b1b',
            wiki: 'https://en.wikipedia.org/wiki/Marjorie_Taylor_Greene',
            avatarImage: 'https://static.scientificamerican.com/dam/m/6e3154abe3ffa521/original/marjorie_taylor_greene_speaks.jpg?m=1752246264.078'
        }
    ]
};

// Load and display public figures based on political orientation
function loadPublicFigures() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    const figuresGrid = document.getElementById('figuresGrid');
    
    if (!figuresGrid) return;
    
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            const category = orientation.category;
            const figures = publicFigures[category] || publicFigures['centrist'];
            
            figuresGrid.innerHTML = figures.map(figure => `
                <div class="figure-card">
                    <div class="figure-header">
                        <div class="figure-avatar" style="background-color: ${figure.color};">
                            ${figure.avatarImage ? 
                                `<img src="${figure.avatarImage}" alt="${figure.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                                 <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">${figure.avatar}</div>` 
                                : 
                                `<div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 600;">${figure.avatar}</div>`
                            }
                        </div>
                        <div>
                            <div class="figure-name">${figure.name}</div>
                            <div class="figure-role">${figure.role}</div>
                        </div>
                    </div>
                    <div class="figure-description">${figure.description}</div>
                    <div class="figure-tags">
                        ${figure.tags.map(tag => `<span class="figure-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="figure-actions">
                        <a href="${figure.wiki}" target="_blank" class="figure-link">
                            Learn More on Wikipedia
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading public figures:', error);
            figuresGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">Unable to load public figures. Please retake the quiz.</p>';
        }
    } else {
        figuresGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">Take the quiz to see public figures aligned with your views.</p>';
    }
}

// Initialize public figures on page load
loadPublicFigures();

// News sources database organized by political orientation
const newsSources = {
    'strong-liberal': [
        {
            name: 'The Young Turks',
            type: 'Digital Media',
            description: 'Progressive news and commentary network known for its liberal perspective and social justice advocacy.',
            tags: ['Progressive', 'Social Justice', 'Commentary', 'Digital'],
            logo: 'TYT',
            url: 'https://tyt.com',
            color: '#1e40af',
            avatarImage: 'data:image/png;base64,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'
        },
        {
            name: 'Democracy Now!',
            type: 'Independent News',
            description: 'Independent news program focusing on social justice, human rights, and progressive politics.',
            tags: ['Independent', 'Social Justice', 'Human Rights', 'Progressive'],
            logo: 'DN',
            url: 'https://democracynow.org',
            color: '#1e40af',
            avatarImage: 'https://yt3.googleusercontent.com/ytc/AIdro_k13evyGyej3TcaRYOEUzR4OSYdCEHnHeQipbK0lJZOs5o=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            name: 'Jacobin',
            type: 'Magazine',
            description: 'Socialist magazine providing analysis of politics, economics, and culture from a leftist perspective.',
            tags: ['Socialist', 'Analysis', 'Politics', 'Economics'],
            logo: 'JB',
            url: 'https://jacobin.com',
            color: '#1e40af',
            avatarImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmE0GxFOZ_1DnWWzD731GaQCAmn9Gpmk5uSA&s'
        }
    ],
    'moderate-liberal': [
        {
            name: 'MSNBC',
            type: 'Cable News',
            description: 'Cable news network with a liberal perspective, focusing on political analysis and progressive viewpoints.',
            tags: ['Cable News', 'Liberal', 'Politics', 'Analysis'],
            logo: 'MS',
            url: 'https://msnbc.com',
            color: '#2563eb',
            avatarImage: 'https://play-lh.googleusercontent.com/lJjZ1cWUDzBTVfzZuPpFNR2xN0AW_7jfOkaA7zd5gCxNg8HtxxHN21l0_7cbODBEGO0'
        },
        {
            name: 'The Washington Post',
            type: 'Newspaper',
            description: 'Major newspaper known for investigative journalism and liberal editorial stance.',
            tags: ['Newspaper', 'Investigative', 'Liberal', 'Politics'],
            logo: 'WP',
            url: 'https://washingtonpost.com',
            color: '#2563eb',
            avatarImage: 'https://yt3.googleusercontent.com/ytc/AIdro_m3npv8LSfXBnC2Os9v2rVsw7Yh2PlJyOFnV_T_iTAHrRc=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            name: 'NPR',
            type: 'Public Radio',
            description: 'Public radio network providing balanced news with a slight liberal lean and in-depth reporting.',
            tags: ['Public Radio', 'Balanced', 'In-depth', 'Liberal'],
            logo: 'NP',
            url: 'https://npr.org',
            color: '#2563eb',
            avatarImage: 'https://yt3.googleusercontent.com/vLilerbtRW24xDHhewrYej9OXaTWLBEAZ5qcJt5Qw6WeXrxcnE_pE2NYpE6h9P6HHWft2vnRbA=s900-c-k-c0x00ffffff-no-rj'
        }
    ],
    'centrist': [
        {
            name: 'Reuters',
            type: 'Wire Service',
            description: 'International news agency known for factual, unbiased reporting and global coverage.',
            tags: ['Wire Service', 'Unbiased', 'Global', 'Factual'],
            logo: 'RT',
            url: 'https://reuters.com',
            color: '#6b7280',
            avatarImage: 'https://yt3.googleusercontent.com/bCcVVrrV0EhGFJKsSvmeZHA9Y-YzSL9Keqrrr0HWYUPQy3-mVUVNHMbjwt7IoVkpsHt4E6BZ3pM=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            name: 'The Associated Press',
            type: 'Wire Service',
            description: 'Nonprofit news cooperative providing factual, neutral reporting to media outlets worldwide.',
            tags: ['Wire Service', 'Neutral', 'Factual', 'Global'],
            logo: 'AP',
            url: 'https://ap.org',
            color: '#6b7280',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/640px-Associated_Press_logo_2012.svg.png'
        },
        {
            name: 'BBC News',
            type: 'International News',
            description: 'British public service broadcaster providing balanced international news coverage.',
            tags: ['International', 'Balanced', 'Public Service', 'Global'],
            logo: 'BB',
            url: 'https://bbc.com/news',
            color: '#6b7280',
            avatarImage: 'https://media.licdn.com/dms/image/v2/D4E0BAQFMp_QONUrE4Q/company-logo_200_200/B4EZfVUv.zGcAQ-/0/1751630676290/bbc_logo?e=2147483647&v=beta&t=YoW0WCjIAFN98OkLtyLBHtQVQpx96pSX83jYbK_FqS8'
        }
    ],
    'moderate-conservative': [
        {
            name: 'The Wall Street Journal',
            type: 'Newspaper',
            description: 'Business-focused newspaper with conservative editorial stance and comprehensive financial coverage.',
            tags: ['Business', 'Conservative', 'Financial', 'Editorial'],
            logo: 'WS',
            url: 'https://wsj.com',
            color: '#dc2626',
            avatarImage: 'https://play-lh.googleusercontent.com/eksxaPfxbTVb6VTl5aj1sXLpKc_N9Z6AZ3_5Oq6JhTXmgEQza-1v58a66p_ID0phE2Zv'
        },
        {
            name: 'Fox News',
            type: 'Cable News',
            description: 'Cable news network with conservative perspective and political commentary.',
            tags: ['Cable News', 'Conservative', 'Politics', 'Commentary'],
            logo: 'FN',
            url: 'https://foxnews.com',
            color: '#dc2626',
            avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/1200px-Fox_News_Channel_logo.svg.png'
        },
        {
            name: 'The National Review',
            type: 'Magazine',
            description: 'Conservative magazine providing political analysis and commentary from a right-leaning perspective.',
            tags: ['Conservative', 'Analysis', 'Politics', 'Commentary'],
            logo: 'NR',
            url: 'https://nationalreview.com',
            color: '#dc2626',
            avatarImage: 'https://play-lh.googleusercontent.com/cC7I7y18SRxHv0vorkzH6Lm2FWK-1rTVmTiIb2wjciyHllbM35VhW7PSMIhLCwGYMAs=w240-h480-rw'
        }
    ],
    'strong-conservative': [
        {
            name: 'Breitbart',
            type: 'Digital Media',
            description: 'Conservative news and opinion website known for its right-wing perspective and political commentary.',
            tags: ['Conservative', 'Right-wing', 'Commentary', 'Digital'],
            logo: 'BB',
            url: 'https://breitbart.com',
            color: '#991b1b',
            avatarImage: 'https://play-lh.googleusercontent.com/px40hKolm6KVWBTdPAxpqGQ-PSq3i0mUp8zk0gc7Ff_Xe4sTYmLptAdI_dBOXZMOrUjW'
        },
        {
            name: 'The Daily Wire',
            type: 'Digital Media',
            description: 'Conservative news and opinion website providing right-leaning political analysis and commentary.',
            tags: ['Conservative', 'Right-wing', 'Analysis', 'Digital'],
            logo: 'DW',
            url: 'https://dailywire.com',
            color: '#991b1b',
            avatarImage: 'https://yt3.googleusercontent.com/DtCfJHbG0-AHij7NPr6b4ka84LoJlkHnLJVIxE_7Pmrv9KsAwIzFyiHITrbZK8zngUxaWCesiFw=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            name: 'Newsmax',
            type: 'Cable News',
            description: 'Conservative cable news network and website providing right-leaning news and commentary.',
            tags: ['Conservative', 'Cable News', 'Right-wing', 'Commentary'],
            logo: 'NM',
            url: 'https://newsmax.com',
            color: '#991b1b',
            avatarImage: 'https://play-lh.googleusercontent.com/2RUpH9Fvf9DoENVQlfiO_YhBN7Pwuz1_MQlCFSiyBNJ1TmO4Hlds99sPBT2tlbBZcHHL'
        }
    ]
};

// Load and display news sources based on political orientation
function loadNewsSources() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    const sourcesGrid = document.getElementById('sourcesGrid');
    
    if (!sourcesGrid) return;
    
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            const category = orientation.category;
            const sources = newsSources[category] || newsSources['centrist'];
            
            sourcesGrid.innerHTML = sources.map(source => `
                <a href="${source.url}" target="_blank" class="source-card">
                    <div class="source-header">
                        <div class="source-logo" style="${source.avatarImage ? 'background-color: transparent;' : `background-color: ${source.color};`} overflow: hidden;">
                            ${source.avatarImage ? 
                                `<img src="${source.avatarImage}" alt="${source.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.parentElement.style.backgroundColor='${source.color}';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;">
                                 <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: 600; position: absolute; top: 0; left: 0;">${source.logo}</div>` 
                                : 
                                `<div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: 600;">${source.logo}</div>`
                            }
                        </div>
                        <div>
                            <div class="source-name">${source.name}</div>
                            <div class="source-type">${source.type}</div>
                        </div>
                    </div>
                    <div class="source-description">${source.description}</div>
                    <div class="source-tags">
                        ${source.tags.map(tag => `<span class="source-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="source-link">
                        Visit Website
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                </a>
            `).join('');
            
        } catch (error) {
            console.error('Error loading news sources:', error);
            sourcesGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">Unable to load news sources. Please retake the quiz.</p>';
        }
    } else {
        sourcesGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">Take the quiz to see news sources aligned with your views.</p>';
    }
}

// Initialize news sources on page load
loadNewsSources();